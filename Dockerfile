FROM alpine:latest
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 10000
CMD [ "npm", "start" ]