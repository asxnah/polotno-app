# легковесный Node.js образ
FROM node:20-alpine

# рабочая директория
WORKDIR /app

# копируем package для установки зависимостей
COPY package.json package-lock.json ./

#У устанавливаем зависимости
RUN npm install

# копируем проект в контейнер
COPY . .

# собираем
RUN npm run build

# открываем порт 4200
EXPOSE 4200

# команда запуска
CMD ["npm", "start"]