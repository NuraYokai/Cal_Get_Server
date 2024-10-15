FROM node
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn global add nodemon
CMD ["nodemon", "--port", "4000", "index.js"]
