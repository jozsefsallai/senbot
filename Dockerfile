FROM node:20.16.0

RUN apt update && apt install -y build-essential g++

WORKDIR /bot
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

CMD [ "pnpm", "start" ]
