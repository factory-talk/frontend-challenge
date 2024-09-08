# Build stage: Node.js environment to build Next.js application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
COPY .env .env

RUN npm run build

# Production stage: Node.js and Nginx
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env


RUN apk add --no-cache nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 3000

CMD ["sh", "-c", "npm run start & nginx -g 'daemon off;'"]
