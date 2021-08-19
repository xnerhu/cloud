FROM nginx:stable
COPY ./frontend/website/build /usr/share/nginx/html
