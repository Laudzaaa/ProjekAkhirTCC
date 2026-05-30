FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Salin semua file sumber aplikasi
COPY . .

# Set mode produksi
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "index.js"]
