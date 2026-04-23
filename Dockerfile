FROM ghcr.io/pterodactyl/panel:latest

USER root

WORKDIR /app

# Copiamos automáticamente las carpetas de Arix en el contenedor para que estén listas para el instalador
# Fusiona las carpetas de origen (app, resources, routes, etc) con las de Pterodactyl
COPY ./arix/theme/pterodactyl/ /app/
COPY ./arix/addons/pterodactyl/ /app/
# Nos aseguramos de mantener dependencias actualizadas
RUN apk update && \
    apk add --no-cache ca-certificates curl git gnupg unzip wget zip bash tar sed nodejs npm yarn ncurses mysql-client jq composer && \
    npm i -g yarn && \
    yarn install && \
    chown -R root:root /app/*

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
COPY ./arixinstaller.sh /arixinstaller.sh
RUN chmod +x /entrypoint.sh /bpinstaller.sh /arixinstaller.sh

# run entrypoint script (migration and setup) and then start supervisor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
