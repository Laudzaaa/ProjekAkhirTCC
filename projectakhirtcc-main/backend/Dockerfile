FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Salin semua file termasuk .env dari direktori build (hasil cloudbuild step)
COPY . . 
COPY .env .env

# Set mode produksi
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "index.js"]
