FROM node:lts-bullseye
WORKDIR /app
RUN npm install pm2 -g

COPY package*.json tsconfig.json ./ 
RUN npm ci --only=production
COPY src ./src
RUN npm run build

EXPOSE 20001
USER node
RUN NODE_ENV=prod 
CMD ["pm2-runtime", "/app/build/index.js"]
