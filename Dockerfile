FROM ghcr.io/pterodactyl/panel:latest

USER root

WORKDIR /app

# Dependencias del sistema. Se instalan ANTES de copiar archivos de Arix porque
# los comandos `php artisan arix` y `php artisan addons` usan rsync para mover
# archivos a /app, y porque necesitamos jq para parsear el release de Blueprint.
#
# IMPORTANTE: NO se instala `nodejs` desde Alpine porque la rama actual trae
# Node 24, que rompe `yarn build:production` dentro de los instaladores de
# Arix (exit code 1). Fijamos Node 20 (LTS) con el build musl no-oficial:
# los paquetes `react-icons`, `markdown-to-jsx`, `@dnd-kit/*` y el webpack
# legacy del panel Pterodactyl/Arix se probaron y funcionan con Node 17-20.
RUN apk update && \
    apk add --no-cache ca-certificates curl git gnupg unzip wget zip bash tar sed \
    ncurses mysql-client jq rsync libstdc++ && \
    (apk del --no-cache nodejs npm yarn 2>/dev/null || true)

# Instalar Node.js 20 LTS (build musl no-oficial, compatible con Alpine).
# Mantener sincronizado con una versión de la línea 20.x.
ENV NODE_VERSION=20.18.1
RUN set -eux; \
    ARCH="$(uname -m)"; \
    case "$ARCH" in \
    x86_64)  NODE_ARCH=x64 ;; \
    aarch64) NODE_ARCH=arm64 ;; \
    *) echo "Arquitectura no soportada para Node musl: $ARCH"; exit 1 ;; \
    esac; \
    curl -fsSLO --compressed "https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}-musl.tar.xz"; \
    tar -xJf "node-v${NODE_VERSION}-linux-${NODE_ARCH}-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner; \
    rm "node-v${NODE_VERSION}-linux-${NODE_ARCH}-musl.tar.xz"; \
    ln -sf /usr/local/bin/node /usr/local/bin/nodejs; \
    npm install -g yarn@1.22.22; \
    node --version; npm --version; yarn --version

# Copiamos las carpetas de Arix en el contenedor para que estén listas para el
# instalador. Fusiona las carpetas de origen (app, config, arix/<ver>, addons/<ver>)
# con las de Pterodactyl.
#   - `arix/theme/pterodactyl/`   => comando `arix`   + config + carpeta `arix/v2.0.7/`
#   - `arix/addons/pterodactyl/`  => comando `addons` + config + carpeta `addons/v1.3.6/`
COPY ./arix/theme/pterodactyl/ /app/
COPY ./arix/addons/pterodactyl/ /app/

# Regenerar el autoloader de Composer para que los comandos recién copiados
# (Arix, Addons, ArixLang) sean descubiertos por Laravel/Artisan al arrancar.
# Sin esto las rutas Pterodactyl\\Console\\Commands\\Arix no se resuelven cuando
# la imagen se construye sobre el classmap optimizado del panel.
RUN if [ -f /app/composer.json ]; then cd /app && composer dump-autoload --no-scripts --optimize 2>/dev/null || true; fi

RUN chown -R root:root /app/*

# Configurar cliente MariaDB para no exigir SSL (Fix ERROR 2026)
# NOTA DE SEGURIDAD: Esto deshabilita SSL para la conexión entre Panel -> Base de Datos (interna en Docker).
# Es necesario porque el contenedor de MariaDB por defecto no tiene certificados configurados y el cliente
# nuevo rechaza conexiones planas.
#
# SI EN EL FUTURO QUIERES FORZAR SSL/TLS EN PRODUCCIÓN:
# 1. Configura certificados SSL válidos en el servicio de 'database' (mariadb) en docker-compose.yml.
# 2. Elimina o comenta el siguiente bloque RUN.
RUN mkdir -p /etc/my.cnf.d && \
    echo "[client]" > /etc/my.cnf.d/nossl.cnf && \
    echo "ssl=0" >> /etc/my.cnf.d/nossl.cnf && \
    echo "ssl-verify-server-cert=0" >> /etc/my.cnf.d/nossl.cnf

# Crear directorio de logs de supervisord
RUN mkdir -p /var/log/supervisord

COPY ./entrypoint.sh /entrypoint.sh
COPY ./bpinstaller.sh /bpinstaller.sh
COPY ./arixinstaller.sh /arixinstaller.sh
RUN chmod +x /entrypoint.sh /bpinstaller.sh /arixinstaller.sh

# run entrypoint script (migration and setup) and then start supervisor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
