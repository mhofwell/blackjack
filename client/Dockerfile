
FROM node:21

# turn off extra external api calls
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false

# needed to bring this variable into the build
ARG API_PUBLIC_URL

WORKDIR /app

COPY next.config.js package*.json ./

RUN npm ci

COPY . .

RUN npm run build:production

EXPOSE 3000

CMD [ "npm", "start"]