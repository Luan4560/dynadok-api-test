FROM node:20-slim

WORKDIR /app

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Verify build output
RUN ls -la dist/

EXPOSE 4000

# Use node directly to run the built file
CMD ["node", "dist/index.js"] 