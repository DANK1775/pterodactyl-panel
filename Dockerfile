FROM ghcr.io/pterodactyl/panel:latest

USER root

WORKDIR /app

# Dependencias del sistema. Se instalan ANTES de copiar archivos de Arix porque
# los comandos `php artisan arix` y `php artisan addons` usan rsync para mover
# archivos a /app, y porque necesitamos jq para parsear el release de Blueprint.
RUN apk update && \
    apk add --no-cache ca-certificates curl git gnupg unzip wget zip bash tar sed \
    nodejs npm yarn ncurses mysql-client jq rsync

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
