FROM node:18-alpine

# Встановлення робочої директорії
WORKDIR /app

# Копіювання package.json та package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всіх файлів до робочої директорії
COPY . .

# Відкриття порту
EXPOSE 3100

# Запуск програми
CMD ["npm", "start"]