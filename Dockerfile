FROM ghcr.io/pterodactyl/panel:latest

USER root

WORKDIR /app

# install basic dependencies (node/yarn) if needed for custom assets
# jq agregado para análisis robusto de JSON en el instalador de Blueprint (PR #571)
RUN apk update && \
    apk add --no-cache ca-certificates curl git gnupg unzip wget zip bash tar sed nodejs npm yarn ncurses mysql-client jq && \
    npm i -g yarn && \
    yarn install --frozen-lockfile

# build assets
RUN export NODE_OPTIONS=--openssl-legacy-provider && \
    yarn build:production

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
