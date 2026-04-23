#!/bin/bash
set -e

export TERM=xterm
export DEBIAN_FRONTEND=noninteractive

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
    local out_file
    out_file=$(mktemp)

    set +e
    yes | "$@" 2>&1 | tee "$out_file"
    local cmd_exit=${PIPESTATUS[1]}
    set -e

    if [ "$cmd_exit" -ne 0 ]; then
        echo "❌ ${label}: instalador terminó con código ${cmd_exit}."
        rm -f "$out_file"
        return 1
    fi

    if grep -qiE "Fail, please contact Weijers\.one\.|error Command failed with exit code 1" "$out_file"; then
        echo "❌ ${label}: se detectó fallo de validación/build en salida del instalador."
        rm -f "$out_file"
        return 1
    fi

    rm -f "$out_file"
    return 0
}

# Detectar usuario web
if id "nginx" &>/dev/null; then
    OWNERSHIP="nginx:nginx"
else
    OWNERSHIP="www-data:www-data"
fi

# Limpiar caché ANTES de instalar para que Laravel detecte los comandos nuevos
# (Si subes los archivos físicos pero Laravel no los ha registrado, el artisan falla)
echo "🧹 Limpiando caché previa de Laravel..."
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
composer dump-autoload 2>/dev/null || true

ADDON_LICENSE_KEY="$(read_env_value "PLUGINS_ADDON_LICENSE_KEY")"
THEME_LICENSE_KEY="$(read_env_value "ARIX_LICENSE_KEY")"
ARIX_COMPONENT_INSTALLED=false

# 1. Instalar Arix Addon Pack (solo si licencia valida)
if validate_arix_license "https://api.arix.gg/resource/arix-addons/verify" "$ADDON_LICENSE_KEY" "Arix Addons"; then
    echo "📦 Ejecutando instalación de Arix Addon Pack..."
    install_with_output_guard "Arix Addons" php artisan addons install --no-interaction
    ARIX_COMPONENT_INSTALLED=true
else
    echo "⏭️ Saltando instalación de Arix Addons."
fi

# 2. Instalar Arix Theme (solo si licencia valida)
if validate_arix_license "https://arix.gg/license/arix-theme" "$THEME_LICENSE_KEY" "Arix Theme"; then
    echo "🎨 Ejecutando instalación de Arix Theme..."
    install_with_output_guard "Arix Theme" php artisan arix install --no-interaction
    ARIX_COMPONENT_INSTALLED=true
else
    echo "⏭️ Saltando instalación de Arix Theme."
fi

# 3. Comandos de optimización y resolución de errores (Basado en la documentación oficial)
echo "⚙️ Ejecutando migraciones y optimizaciones tras instalar Arix..."
php artisan migrate --force
php artisan optimize:clear
php artisan optimize
chmod -R 755 storage/* bootstrap/cache
php artisan route:clear
php artisan optimize

# 4. Ajustar permisos según la documentación de Arix
echo "🔒 Estableciendo permisos de storage y cache..."
chmod -R 755 storage/* bootstrap/cache 2>/dev/null || true
chown -R "$OWNERSHIP" storage bootstrap/cache 2>/dev/null || true

if [ "$ARIX_COMPONENT_INSTALLED" = true ]; then
    touch /app/.arix_installed
fi

echo "✨ Instalación de Arix completada exitosamente!"
