FROM node:22-alpine AS build
WORKDIR /app

COPY client/package*.json ./client/
RUN npm install --prefix client
COPY client ./client
RUN npm run build --prefix client

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./server/
RUN npm install --omit=dev --prefix server
COPY server ./server
COPY --from=build /app/client/dist ./client/dist

EXPOSE 5000
CMD ["node", "server/server.js"]
