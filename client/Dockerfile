
FROM node:21

# turn off extra external api calls
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false

ARG API_URL_PUBLIC

WORKDIR /app

COPY next.config.js package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start"]