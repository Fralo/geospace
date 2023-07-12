FROM node:18.3.0-alpine3.14 as build

WORKDIR /app

COPY package.json ./
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.21.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html



