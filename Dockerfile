FROM node:20.16.0

RUN apt update && apt install -y \
    build-essential \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg8-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /bot
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

CMD [ "pnpm", "start" ]
