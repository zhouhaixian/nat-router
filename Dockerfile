FROM node:bookworm-slim

WORKDIR /app
COPY package*.json ./
RUN corepack enable pnpm
RUN pnpm install
COPY src /app
COPY tsconfig.json /app
RUN pnpm run build

EXPOSE 9000
CMD [ "node", "/app/dist/app.js" ]