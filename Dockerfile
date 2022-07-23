FROM node:lts-bullseye as ts-compiler
WORKDIR /app

COPY package*.json tsconfig.json ./ 
RUN npm install
COPY src ./src
RUN npm run build

FROM node:lts-bullseye
WORKDIR /app
COPY --from=ts-compiler /app/build /app/package*.json ./
RUN npm ci --only=production

RUN npm install pm2 -g
EXPOSE 4444
USER node
RUN NODE_ENV=prod 
CMD ["pm2-runtime", "/app/build/index.js"]
