#!/bin/bash
set -e

export TERM=xterm
export DEBIAN_FRONTEND=noninteractive

echo "🚀 Iniciando proceso de instalación/configuración de Arix Theme y Addon Pack..."

cd /app || exit

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

# 1. Instalar Arix Addon Pack
# Verificamos si la variable PLUGINS_ADDON_LICENSE_KEY existe y no está vacía
if [ -n "$PLUGINS_ADDON_LICENSE_KEY" ] || (grep -q '^PLUGINS_ADDON_LICENSE_KEY=' /app/.env && [ -n "$(grep '^PLUGINS_ADDON_LICENSE_KEY=' /app/.env | cut -d'=' -f2 | sed "s/['\"]//g")" ]); then
    echo "📦 Licencia de Addons detectada. Ejecutando instalación de Arix Addon Pack..."
    yes | php artisan addons install --no-interaction
else
    echo "⏭️ PLUGINS_ADDON_LICENSE_KEY no encontrada o vacía. Saltando instalación de Arix Addon Pack."
fi

# 2. Instalar Arix Theme
# Verificamos si la variable ARIX_LICENSE_KEY existe y no está vacía
if [ -n "$ARIX_LICENSE_KEY" ] || (grep -q '^ARIX_LICENSE_KEY=' /app/.env && [ -n "$(grep '^ARIX_LICENSE_KEY=' /app/.env | cut -d'=' -f2 | sed "s/['\"]//g")" ]); then
    echo "🎨 Licencia de Tema detectada. Ejecutando instalación de Arix Theme..."
    yes | php artisan arix install --no-interaction
else
    echo "⏭️ ARIX_LICENSE_KEY no encontrada o vacía. Saltando instalación de Arix Theme."
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

echo "✨ Instalación de Arix completada exitosamente!"
