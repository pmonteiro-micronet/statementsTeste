FROM node:18-buster

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npm install prisma --save-dev
RUN npx prisma generate

COPY . .

# Copia o .env com variáveis necessárias
COPY .env .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
