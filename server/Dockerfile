FROM node:21
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . /server
CMD ["npm", "start"]
EXPOSE 4000
EXPOSE 3000