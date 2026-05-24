FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy pre-built files
COPY build ./build
COPY server.js .

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
