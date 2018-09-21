FROM nginx:stable

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

COPY out /usr/share/nginx/html
