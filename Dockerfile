
ARG prod=false

FROM node:20-alpine

RUN apk --no-cache update
RUN apk --no-cache upgrade

RUN npm install -g pm2

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install $([[ $prod = 'true' ]] && echo --production || echo )

COPY . .

CMD [ "pm2-runtime", "start", "index.js" ]
