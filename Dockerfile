FROM ghcr.io/pterodactyl/panel:latest

USER root

WORKDIR /app

# Dependencias del sistema. Necesitamos jq para parsear el release de Blueprint.
#
# Fijamos Node 20 (LTS) con el build musl no-oficial para evitar problemas
# con Node 24 en Alpine.
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
RUN chmod +x /entrypoint.sh /bpinstaller.sh

# run entrypoint script (migration and setup) and then start supervisor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
