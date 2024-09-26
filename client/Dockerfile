FROM node:21
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . /client
CMD ["npm", "start"]
EXPOSE 4000