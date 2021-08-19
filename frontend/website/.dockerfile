FROM nginx:stable
COPY ./web/website/build /usr/share/nginx/html
