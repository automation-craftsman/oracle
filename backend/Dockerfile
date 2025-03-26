FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm install --production

COPY . .

FROM node:18-slim
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./

EXPOSE 3000

CMD ["node", "server.js"]