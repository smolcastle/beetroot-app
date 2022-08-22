# Install dependencies only when needed
FROM node:16 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps


# Rebuild the source code only when needed
FROM node:16 AS builder
ARG OPENSEA_KEY

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN touch .env
RUN echo "OPENSEA_KEY=${OPENSEA_KEY}" >> .env

RUN npm run build

# Build nginx
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
