require('dotenv').config({path:".env"})
const { SERVER_PORT } = process.env;
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const webSocket = require('./socket');
const router = require('./router');
const { connectToDatabase } = require("./db");
/**
 * cors는 croos-origin resource sharing의 약자이며 자신이 속하지 않은 다른 도메인, 프로토콜, 포트에 있는
 * 리소스를 요청하는 http 요청방식입니다.
 * cors 방식 허용하는 방법 2가지
 * 1. 모두에게 허용하기
 * const cors = require('cors');
 * const PORT = 8080;
 * app.use(cors());
 * 
 * 2. 특정 도메인에만 허용하기
 * const cors = require('cors');
 * const PORT = 8080;
 * let corsOptions = {
 * origin: 'https://www.domain.com',
 * credentials: true
 * }
 * app.use(cors(corsOptions));
 * 
*/

//서버 DB 연결
connectToDatabase();
app.use(cors());
app.use(router);
app.use(express.json());

const server = http.createServer(app);
// origin whitelist 설정
const whiteList = ['http://192.168.10.79:5500', "http://localhost:3000"]
// 모든곳에서 들어오도록 설정
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

//웹서버를 시작하여 지정포트에서 대기하도록 설정
server.listen(SERVER_PORT, () => console.log(`포트 ${SERVER_PORT}번에서 서버 가동중입니다.`));

//웹소켓 시작
webSocket(io);