#!/bin/bash
set -e

export TERM=xterm
export DEBIAN_FRONTEND=noninteractive
export NODE_OPTIONS=--openssl-legacy-provider

echo "🚀 Iniciando proceso de instalación/configuración de Arix Theme y Addon Pack..."

cd /app || exit

read_env_value() {
    local key="$1"
    local from_env="${!key}"

    if [ -n "$from_env" ]; then
        echo "$from_env"
        return 0
    fi

    if [ -f "/app/.env" ]; then
        grep "^${key}=" /app/.env | tail -n 1 | cut -d'=' -f2- | sed "s/['\"]//g"
    fi
}

validate_arix_license() {
    local endpoint="$1"
    local license_key="$2"
    local label="$3"

    if [ -z "$license_key" ]; then
        echo "⏭️ ${label}: licencia vacía, se omite instalación."
        return 1
    fi

    if ! command -v curl >/dev/null 2>&1; then
        echo "⚠️ curl no disponible, no se pudo validar ${label}."
        return 1
    fi

    if ! command -v jq >/dev/null 2>&1; then
        echo "⚠️ jq no disponible, no se pudo validar ${label}."
        return 1
    fi

    local response
    response=$(curl -sS --max-time 30 -X POST -d "license=${license_key}" "$endpoint" || true)

    if echo "$response" | jq -e '.success == true' >/dev/null 2>&1; then
        echo "✅ ${label}: licencia validada."
        return 0
    fi

    echo "❌ ${label}: licencia inválida o no verificable, se omite instalación para evitar frontend en blanco."
    return 1
}

install_with_output_guard() {
    local label="$1"
    shift
    local log_dir="/app/storage/logs"
    local slug
    slug="$(echo "$label" | tr '[:upper:] ' '[:lower:]-')"
    mkdir -p "$log_dir" 2>/dev/null || true
    local out_file="${log_dir}/arix-install-${slug}.log"

    # Los comandos `php artisan arix install` y `php artisan addons install` usan:
    #   1) confirm('dependencias instaladas?', default=yes)  -> 'y' o línea vacía
    #   2) choice('Select a version:', $versions)            -> índice numérico ('0')
    #   3) Posible confirm adicional (addons, NODE_OPTIONS)  -> 'y' o línea vacía
    #
    # NO podemos usar `--no-interaction` porque `choice()` no tiene default y tira
    # excepción. Tampoco podemos usar `yes | ...` porque "y" como respuesta a la
    # pregunta de `choice()` es inválido y provoca que Symfony aborte tras varios
    # reintentos. Alimentamos stdin con la secuencia exacta: y, 0, y, y, ...
    set +e
    {
        echo y
        echo 0
        # Respuestas extra para cualquier prompt de confirm posterior.
        for _ in $(seq 1 20); do echo y; done
    } | "$@" 2>&1 | tee "$out_file"
    local cmd_exit=${PIPESTATUS[1]}
    set -e

    if [ "$cmd_exit" -ne 0 ]; then
        echo "❌ ${label}: instalador terminó con código ${cmd_exit}."
        echo "   Log completo: ${out_file}"
        return 1
    fi

    # El instalador PHP usa exec() y NO propaga códigos de error: incluso cuando
    # `yarn build:production` falla, imprime el banner "installed successfully".
    # Por eso inspeccionamos la salida en busca de indicadores de fallo reales.
    if grep -qiE "Fail, please contact Weijers\.one\.|error Command failed with exit code 1|License is invalid" "$out_file"; then
        echo "❌ ${label}: se detectó fallo de validación/build en salida del instalador."
        echo "   Log completo: ${out_file}"
        echo "   --- Últimas líneas del log (para diagnóstico) ---"
        tail -n 40 "$out_file" | sed 's/^/   | /'
        echo "   --- Fin del fragmento ---"
        return 1
    fi

    return 0
}

# Detectar usuario web
if id "nginx" &>/dev/null; then
    OWNERSHIP="nginx:nginx"
else
    OWNERSHIP="www-data:www-data"
fi

# Verificar que rsync esté disponible (requerido por `php artisan arix install`
# y `php artisan addons install`). Si no está, intentar instalarlo.
if ! command -v rsync >/dev/null 2>&1; then
    echo "⚠️ rsync no encontrado. Intentando instalar (requerido por los instaladores de Arix)..."
    apk add --no-cache rsync 2>/dev/null || apt-get install -y rsync 2>/dev/null || true
fi

# Limpiar caché ANTES de instalar para que Laravel detecte los comandos nuevos
# (Si subes los archivos físicos pero Laravel no los ha registrado, el artisan falla)
echo "🧹 Limpiando caché previa de Laravel..."
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
composer dump-autoload --no-scripts 2>/dev/null || true

# 📦 FIX: Instalar dependencias faltantes para la compilación de Arix/Addons
# Solo instalamos paquetes que realmente faltan en package.json para evitar
# reinstalaciones innecesarias en cada arranque del contenedor.
echo "📦 Verificando dependencias JS críticas para compilar Arix/Addons..."
if [ -f /app/package.json ]; then
    REQUIRED_JS_DEPS=(
        xterm-addon-unicode11
        @preact/signals-react
        styled-components
        redux
        react-icons
        markdown-to-jsx
        @dnd-kit/core
        @dnd-kit/sortable
        @dnd-kit/utilities
    )

    MISSING_DEPS_FILE="$(mktemp -t arix_deps.XXXXXX)" || {
        echo "❌ No se pudo crear archivo temporal para dependencias JS."
        exit 1
    }
    if node - "${REQUIRED_JS_DEPS[@]}" > "$MISSING_DEPS_FILE" <<'NODE_EOF'
const fs = require("fs");

try {
    const pkg = JSON.parse(fs.readFileSync("/app/package.json", "utf8"));
    const installed = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
    const required = process.argv.slice(2);
    const missing = required.filter((name) => !installed[name]);

    for (const dep of missing) {
        console.log(dep);
    }
} catch (error) {
    console.error("No se pudo leer o parsear /app/package.json:", error.message);
    process.exit(1);
}
NODE_EOF
    then
        MISSING_JS_DEPS=()
        while IFS= read -r dep; do
            dep="${dep#"${dep%%[![:space:]]*}"}"
            dep="${dep%"${dep##*[![:space:]]}"}"
            [ -n "$dep" ] && MISSING_JS_DEPS+=("$dep")
        done < "$MISSING_DEPS_FILE"
    else
        rm -f "$MISSING_DEPS_FILE"
        echo "❌ Falló la detección de dependencias JS faltantes."
        exit 1
    fi
    rm -f "$MISSING_DEPS_FILE"

    if [ "${#MISSING_JS_DEPS[@]}" -gt 0 ]; then
        echo "📦 Instalando dependencias faltantes: ${MISSING_JS_DEPS[*]}"
        yarn add --ignore-engines "${MISSING_JS_DEPS[@]}"
    else
        echo "✅ Todas las dependencias JS críticas ya están instaladas."
    fi
else
    echo "⚠️ /app/package.json no encontrado; se omite instalación de dependencias JS."
fi

# Verificar que los comandos de Arix estén registrados en Artisan antes de usarlos.
# Si no lo están, probablemente los archivos no se copiaron al /app o el autoloader
# no se regeneró — fallar rápido con un mensaje útil en vez de intentar instalar.
if ! php artisan list --raw 2>/dev/null | grep -q '^arix'; then
    echo "⚠️ Comando 'arix' NO registrado. ¿Se copió /app/app/Console/Commands/Arix.php? ¿Se ejecutó composer dump-autoload?"
fi
if ! php artisan list --raw 2>/dev/null | grep -q '^addons'; then
    echo "⚠️ Comando 'addons' NO registrado. ¿Se copió /app/app/Console/Commands/Addons.php?"
fi

ADDON_LICENSE_KEY="$(read_env_value "PLUGINS_ADDON_LICENSE_KEY")"
THEME_LICENSE_KEY="$(read_env_value "ARIX_LICENSE_KEY")"
ARIX_COMPONENT_INSTALLED=false
ARIX_COMPONENT_ATTEMPTED=false

# Orden requerido: 1º Tema (asienta la base de assets/traducciones), 2º Addons
# (depende del build de yarn/assets del tema en muchos casos).

# 1. Instalar Arix Theme (solo si licencia valida)
if validate_arix_license "https://arix.gg/license/arix-theme" "$THEME_LICENSE_KEY" "Arix Theme"; then
    ARIX_COMPONENT_ATTEMPTED=true
    echo "🎨 Ejecutando instalación de Arix Theme..."
    if install_with_output_guard "Arix Theme" php artisan arix install; then
        ARIX_COMPONENT_INSTALLED=true
        # Limpiar caché entre componentes para que los nuevos providers/rutas/comandos
        # cargados por el tema estén disponibles al instalar los addons.
        php artisan optimize:clear 2>/dev/null || true
        composer dump-autoload --no-scripts 2>/dev/null || true
    fi
else
    echo "⏭️ Saltando instalación de Arix Theme."
fi

# 2. Instalar Arix Addon Pack (solo si licencia valida)
if validate_arix_license "https://api.arix.gg/resource/arix-addons/verify" "$ADDON_LICENSE_KEY" "Arix Addons"; then
    ARIX_COMPONENT_ATTEMPTED=true
    echo "📦 Ejecutando instalación de Arix Addon Pack..."
    if install_with_output_guard "Arix Addons" php artisan addons install; then
        ARIX_COMPONENT_INSTALLED=true
    fi
else
    echo "⏭️ Saltando instalación de Arix Addons."
fi

# 3. Rebuild de assets de rescate: si se intentó instalar Arix (con o sin éxito)
# recompilamos con stdout directo para (a) asegurar assets frescos aún si el
# instalador reportó fallo y (b) mostrar el error real de webpack si persiste.
if [ "$ARIX_COMPONENT_ATTEMPTED" = true ]; then
    echo "🔧 Recompilando assets del panel (rescate post-Arix)..."
    if yarn build:production; then
        echo "✅ Recompilación de assets completada."
    else
        echo "⚠️ La recompilación de assets falló. Revisa /app/storage/logs/arix-install-*.log."
    fi
fi

# 4. Comandos de optimización y resolución de errores (Basado en la documentación oficial)
echo "⚙️ Ejecutando migraciones y optimizaciones tras instalar Arix..."
php artisan migrate --force
php artisan optimize:clear

# 5. Ajustar permisos ANTES de cachear para que PHP-FPM (nginx) pueda
#    escribir en storage/framework/{sessions,views,cache} y bootstrap/cache.
#    Se usa 775 (no 755) para que el grupo también pueda escribir.
echo "🔒 Estableciendo permisos de storage y cache..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
chown -R "$OWNERSHIP" storage bootstrap/cache 2>/dev/null || true
# Los assets de public/ deben ser legibles por nginx tras el rebuild.
if [ -d /app/public/assets ]; then
    chown -R "$OWNERSHIP" /app/public/assets 2>/dev/null || true
fi

if [ "$ARIX_COMPONENT_INSTALLED" = true ]; then
    touch /app/.arix_installed
fi

echo "✨ Instalación de Arix completada exitosamente!"
