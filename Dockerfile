FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD [ "npm", "start" ]
