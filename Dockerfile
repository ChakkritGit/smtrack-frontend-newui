FROM oven/bun AS builder

WORKDIR /app

COPY . .

RUN bun install

ARG VITE_APP_API
ARG VITE_APP_IMG
ARG VITE_APP_AUTH
ARG VITE_APP_SOCKET
ARG VITE_APP_DOMAIN
ARG VITE_APP_MQTT
ARG VITE_APP_MQTT_PORT
ARG VITE_APP_MQTT_USERNAME
ARG VITE_APP_MQTT_PASSWORD
ARG VITE_APP_VERSION
ARG VITE_APP_SECRETKEY
ARG VITE_APP_MAXAGE
ARG VITE_APP_NODE_ENV

ENV VITE_API_URL=$VITE_APP_API
ENV VITE_SECRET_KEY=$VITE_APP_IMG
ENV VITE_SECRET_KEY=$VITE_APP_AUTH
ENV VITE_SECRET_KEY=$VITE_APP_SOCKET
ENV VITE_SECRET_KEY=$VITE_APP_DOMAIN
ENV VITE_SECRET_KEY=$VITE_APP_MQTT
ENV VITE_SECRET_KEY=$VITE_APP_MQTT_PORT
ENV VITE_SECRET_KEY=$VITE_APP_MQTT_USERNAME
ENV VITE_SECRET_KEY=$VITE_APP_MQTT_PASSWORD
ENV VITE_SECRET_KEY=$VITE_APP_VERSION
ENV VITE_SECRET_KEY=$VITE_APP_SECRETKEY
ENV VITE_SECRET_KEY=$VITE_APP_MAXAGE
ENV VITE_SECRET_KEY=$VITE_APP_NODE_ENV

RUN bun run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 7258

CMD ["nginx", "-g", "daemon off;"]
