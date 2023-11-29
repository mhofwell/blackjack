
FROM node:21

WORKDIR /app

COPY package*.json ./
COPY package-lock.json package-lock.json 
COPY next.config.js ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start"]