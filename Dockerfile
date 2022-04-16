FROM node:16

WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .

EXPOSE 8088
CMD ["npm","start"]
