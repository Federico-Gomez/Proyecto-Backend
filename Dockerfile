FROM node

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 8080

CMD [ "npm", "src/app" ]