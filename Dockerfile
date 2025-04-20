FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./
COPY . .

RUN npm install -g @quasar/cli
RUN npm install


EXPOSE 9000

CMD [ "yarn", "quasar", "dev", "--host", "0.0.0.0" ]