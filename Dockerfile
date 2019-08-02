FROM node:10
WORKDIR /usr/src/app
COPY src src
COPY package*.json ./
COPY pm2.json ./
RUN npm install pm2 -g
EXPOSE 3000
CMD pm2-docker start pm2.json
