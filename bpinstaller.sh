#!/bin/bash
set -eo pipefail

# Guardia: si Blueprint ya fue instalado en este contenedor, salir sin hacer nada
if [ -f "/app/.blueprintrc" ] && [ -f "/app/blueprint.sh" ]; then
    echo "Blueprint ya se encuentra instalado. Saltando."
    exit 0
fi

export TERM=xterm
export DEBIAN_FRONTEND=noninteractive

echo "🚀 Iniciando proceso de instalación de Blueprint en el contenedor..."

# Detectar usuario web correcto (en Alpine/Pterodactyl suele ser nginx, en otras imágenes www-data)
if id "nginx" &>/dev/null; then
    WEBUSER="nginx"
    OWNERSHIP="nginx:nginx"
else
    WEBUSER="www-data"
    OWNERSHIP="www-data:www-data"
fi

echo "Detectado usuario web: $WEBUSER"

# ----------- Blueprint Dependencies Installation ----------- #
# Basado en la lógica del PR #571 pero adaptado para Alpine Linux (Docker)

echo "Verificando dependencias de Blueprint..."

# Node.js 20 ya debe estar instalado en el Dockerfile, pero verificamos la versión
if command -v node &>/dev/null; then
    NODE_VERSION=$(node -v | cut -d. -f1 | tr -d 'v')
    echo "Node.js versión detectada: $(node -v)"
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo "⚠️  Advertencia: Node.js versión $NODE_VERSION detectada. Blueprint requiere Node.js 20+."
        echo "El Dockerfile debe tener Node.js 20 instalado."
    fi
else
    echo "❌ Error: Node.js no está instalado. El Dockerfile debe incluir Node.js 20+."
    exit 1
fi

# Verificar que Yarn esté disponible
if ! command -v yarn &>/dev/null; then
    echo "❌ Error: Yarn no está instalado. El Dockerfile debe incluir Yarn."
    exit 1
fi

echo "✓ Dependencias verificadas correctamente"

# ----------- Blueprint Installation ----------- #

echo "Instalando Blueprint framework..."

cd /app || exit

# Obtener la URL del release más reciente con manejo robusto de errores
# Basado en el enfoque del PR #571 con fallback
BLUEPRINT_URL=""

if command -v jq >/dev/null 2>&1; then
    # Preferir análisis JSON robusto con jq cuando esté disponible
    echo "Obteniendo URL de release usando jq..."
    BLUEPRINT_URL=$(curl -s --connect-timeout 30 --max-time 60 https://api.github.com/repos/BlueprintFramework/framework/releases/latest \
      | jq -r '.assets[]? | select(.name == "release.zip") | .browser_download_url' \
      | head -n 1)
else
    # Fallback a análisis basado en texto para máxima compatibilidad
    echo "jq no disponible, usando análisis de texto..."
    BLUEPRINT_URL=$(curl -s --connect-timeout 30 --max-time 60 https://api.github.com/repos/BlueprintFramework/framework/releases/latest \
      | grep 'browser_download_url' | grep 'release.zip' | cut -d '"' -f 4)
fi

# Si no se pudo obtener la URL, usar fallback directo
if [ -z "$BLUEPRINT_URL" ]; then
    echo "⚠️  No se pudo obtener la URL del release, usando URL de fallback..."
    BLUEPRINT_URL="https://github.com/BlueprintFramework/framework/releases/latest/download/release.zip"
fi

echo "Descargando Blueprint desde: $BLUEPRINT_URL"

# Descargar con timeouts y manejo de errores mejorado
if ! curl --connect-timeout 30 --max-time 300 -Lo blueprint-release.zip "$BLUEPRINT_URL"; then
    echo "❌ Error: Falló la descarga de Blueprint framework"
    exit 1
fi

# Verificar que el archivo descargado no esté vacío
if [ ! -s blueprint-release.zip ]; then
    echo "❌ Error: El archivo descargado está vacío"
    rm -f blueprint-release.zip
    exit 1
fi

echo "Extrayendo Blueprint framework..."

# Extraer Blueprint (sobrescribir archivos existentes)
if ! unzip -o blueprint-release.zip; then
    echo "❌ Error: Falló la extracción de Blueprint framework"
    rm -f blueprint-release.zip
    exit 1
fi

# Eliminar el archivo zip descargado
rm -f blueprint-release.zip

echo "Configurando Blueprint (.blueprintrc)..."

# Crear la configuración de Blueprint (.blueprintrc) antes de ejecutar su instalador
cat > /app/.blueprintrc << BPRC
WEBUSER="$WEBUSER";
OWNERSHIP="$OWNERSHIP";
USERSHELL="/bin/bash";
BPRC

# Verificar que blueprint.sh existe y hacerlo ejecutable
if [ ! -f "/app/blueprint.sh" ]; then
    echo "❌ Error: blueprint.sh no fue encontrado después de la extracción"
    exit 1
fi

chmod +x blueprint.sh

echo "Instalando dependencias de Yarn para Blueprint..."

# Instalar dependencias de yarn (solo producción, como en el PR)
if ! yarn install --production --frozen-lockfile; then
    echo "❌ Error: Falló la instalación de dependencias de Blueprint"
    exit 1
fi

echo "Ejecutando instalador de Blueprint..."

# Ejecutar el instalador de Blueprint automatizando sus prompts interactivos con 'yes'
# pipefail garantiza que un error en blueprint.sh se propague correctamente
if ! yes | bash blueprint.sh; then
    echo "❌ Error: El instalador de Blueprint falló"
    exit 1
fi

# Establecer permisos correctos después de la instalación de Blueprint
echo "Estableciendo permisos correctos..."
chown -R "$OWNERSHIP" /app/storage /app/bootstrap/cache /app/.blueprintrc /app/.blueprint 2>/dev/null || true
chmod -R 775 /app/storage /app/bootstrap/cache 2>/dev/null || true

echo "✨ Instalación de Blueprint completada exitosamente!"
