# Base stage for shared dependencies and configuration
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Development stage
FROM base AS dev
# Nodemon is used for hot-reloading in development
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app

# Only copy necessary files from base
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/src ./src
COPY --from=base /app/prisma ./prisma

# Prune dev dependencies
RUN npm prune --production

EXPOSE 8081

CMD ["node", "src/server.js"]
