#!/bin/bash
set -eo pipefail

# ──────────────────────────────────────────────────────────────
# Auto-bootstrap: generar .env si no existe o falta APP_KEY
# Esto permite que un clone fresco funcione con solo "docker compose up -d"
# ──────────────────────────────────────────────────────────────
# Normalizar saltos de línea CRLF (Windows) a LF para que grep/sed funcionen
if [ -f "/app/.env" ]; then
    sed 's/\r//' /app/.env > /tmp/.env.tmp && cat /tmp/.env.tmp > /app/.env && rm /tmp/.env.tmp
fi

if [ ! -s "/app/.env" ]; then
    echo "Archivo .env no encontrado o vacío. Generando configuración inicial..."
    cat > /app/.env <<'ENVEOF'
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_THEME=pterodactyl
APP_TIMEZONE=UTC
APP_URL=http://localhost
APP_ENVIRONMENT_ONLY=false
DB_HOST=database
DB_PORT=3306
DB_DATABASE=panel
DB_USERNAME=pterodactyl
DB_PASSWORD=pterodactyl_secret_pw
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=cache
REDIS_PASSWORD=null
REDIS_PORT=6379
MAIL_DRIVER=log
MAIL_HOST=localhost
MAIL_PORT=25
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM=no-reply@example.com
MAIL_FROM_NAME="Pterodactyl Panel"
HASHIDS_SALT=
HASHIDS_LENGTH=8
ENVEOF
fi

# Generar APP_KEY si está vacío
if grep -q '^APP_KEY=$' /app/.env || grep -q '^APP_KEY=""' /app/.env; then
    echo "Generando APP_KEY..."
    APP_KEY_VALUE=$(php -r "echo 'base64:' . base64_encode(random_bytes(32));")
    sed "s|^APP_KEY=.*|APP_KEY=${APP_KEY_VALUE}|" /app/.env > /tmp/.env.tmp && cat /tmp/.env.tmp > /app/.env && rm /tmp/.env.tmp
    echo "APP_KEY generado: ${APP_KEY_VALUE}"
fi

chmod 644 /app/.env
chown nginx:nginx /app/.env || chown www-data:www-data /app/.env || true

echo "Esperando a la base de datos..."
sleep 10

php artisan migrate --force --seed --step

# Instalar Blueprint y reconstruir assets SOLO si aún no está instalado.
# La guardia usa los mismos archivos que comprueba bpinstaller.sh.
if [ ! -f "/app/.blueprintrc" ] || [ ! -f "/app/blueprint.sh" ]; then
    echo "Instalando Blueprint framework..."
    bash /bpinstaller.sh

    # Después de instalar Blueprint, reconstruir los assets del panel modificado
    echo "Reconstruyendo assets del panel modificado por Blueprint..."

    # 1. Asegurar todas las dependencias de Node (ahora necesitamos las dev también para build)
    yarn install --frozen-lockfile

    # 2. Ejecutar comando de Blueprint para inyectar/preparar assets en resources
    php artisan blueprint:build --no-interaction || echo "⚠️  Fallo blueprint:build, continuando..."

    # 3. Compilar producción final (Webpack/Vite)
    export NODE_OPTIONS=--openssl-legacy-provider
    yarn run build:production
else
    echo "Blueprint ya está instalado, saltando instalación."
fi

# Publicar assets de Blueprint y extensiones en public/
# Esto es necesario porque Blueprint genera los assets en .blueprint/ pero no los
# copia automáticamente al directorio público servido por Nginx.
if [ -d "/app/.blueprint/extensions" ]; then
    echo "Publicando assets de extensiones Blueprint..."
    for ext_dir in /app/.blueprint/extensions/*/assets; do
        if [ -d "$ext_dir" ]; then
            ext_name=$(basename "$(dirname "$ext_dir")")
            mkdir -p "/app/public/assets/extensions/$ext_name"
            cp -r "$ext_dir"/* "/app/public/assets/extensions/$ext_name/" 2>/dev/null || true
            echo "  -> Assets publicados para: $ext_name"
        fi
    done
fi

# Volver a asegurar permisos en caso de que Blueprint haya creado algo
echo "Ajustando permisos y migraciones finales..."
chown -R nginx:nginx /app/storage /app/bootstrap/cache /app/.blueprintrc /app/.blueprint /app/public || chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/.blueprintrc /app/.blueprint /app/public || true
chmod -R 775 /app/storage /app/bootstrap/cache /app/.blueprintrc /app/.blueprint /app/public || true

# Asegurar que el directorio de assets exista y tenga permisos
if [ -d "/app/public/assets" ]; then
    chown -R nginx:nginx /app/public/assets || chown -R www-data:www-data /app/public/assets || true
    chmod -R 755 /app/public/assets
fi

#migracion final para asegurarnos que todo lo que se instalo migre (es un requisito de bp y algunos plugins)
php artisan migrate --force --seed --step

# Configurar SSL si se proveen certificados
CERT_FILE=""
KEY_FILE=""

if [ -f "/etc/certs/cert.pem" ] && [ -f "/etc/certs/key.pem" ]; then
    CERT_FILE="/etc/certs/cert.pem"
    KEY_FILE="/etc/certs/key.pem"
elif [ -f "/etc/certs/fullchain.pem" ] && [ -f "/etc/certs/privkey.pem" ]; then
    CERT_FILE="/etc/certs/fullchain.pem"
    KEY_FILE="/etc/certs/privkey.pem"
fi

if [ -n "$CERT_FILE" ] && [ -n "$KEY_FILE" ]; then
    echo "Certificados detectados en /etc/certs/. Configurando Nginx para usar SSL..."
    # Busca en cualquier archivo de coniguración de nginx para asegurarse de inyectar el SSL donde esté escuchando el puerto 80
    for conf in /etc/nginx/http.d/*.conf; do
        if [ -f "$conf" ]; then
            grep -q "listen 443" "$conf" || \
            sed -i "s|listen 80;|listen 80;\n    listen 443 ssl;\n    http2 on;\n    ssl_certificate $CERT_FILE;\n    ssl_certificate_key $KEY_FILE;|g" "$conf"

            # Reemplazar server_name _ por el dominio de APP_URL si existe
            if [ -f "/app/.env" ]; then
                APP_DOMAIN=$(grep '^APP_URL=' /app/.env | cut -d'=' -f2 | tr -d '"' | sed 's|^https://||; s|^http://||; s|/.*||')
                if [ -n "$APP_DOMAIN" ]; then
                    sed -i "s|server_name _;|server_name $APP_DOMAIN;|g" "$conf"
                    echo "Configurado server_name a $APP_DOMAIN en $conf"
                fi
            fi
        fi
    done
fi

echo "Iniciando Pterodactyl..."
exec "$@"
