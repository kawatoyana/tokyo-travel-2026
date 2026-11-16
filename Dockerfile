FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV ALLOW_PORT_8080=true

EXPOSE 8080
CMD ["npm", "start"]
