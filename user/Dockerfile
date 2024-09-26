FROM node:21
WORKDIR /user
COPY package*.json ./
RUN npm install
COPY . /user
CMD ["npm", "start"]
EXPOSE 3001