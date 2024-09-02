FROM node:22-alpine3.19

WORKDIR /app/client

COPY package*.json .
COPY prisma/schema.prisma .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]