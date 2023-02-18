FROM node:16.3.0

RUN apt update && apt install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /bot
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
