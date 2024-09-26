import React from 'react';
import io from "socket.io-client";
import { SERVER_URL } from '../config';
// socket 전역변수 설정

export const socket = io.connect(SERVER_URL);
export const SocketContext = React.createContext(socket);