FROM node
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn global add nodemon
CMD ["nodemon", "index.js"]
