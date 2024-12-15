FROM node:23.3.0-bookworm-slim
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn global add nodemon
CMD ["nodemon", "index.js"]
