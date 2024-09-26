import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';
import {SocketContext, socket} from './context/socket';
import History from './ui/history';
import RoomInfo from './components/RoomInfo';
import Login from './ui/login';
import Signup from './ui/signup';
import Home from './ui/home';
import CounselerList from './components/CounselerList';
import React from 'react';
import ChatUser from './ui/chatUser';
import MyPage from './components/Mypage';


// socketContext 전역변수와 Recoil 라이브러리를 사용해서 선언한 전역변수를 사용하기 위해 App에 선언

function App() {

  return (
    <>
    <SocketContext.Provider value={socket}>
    <RecoilRoot>
      <ChatHeader><a href="/">상담서버 구축</a></ChatHeader>
    <Routes>
         <Route path="/" exact={true}  element={<Login />}></Route>
         <Route path="/ui/home" element={<Home />}></Route>
         <Route path="admin/CounselerList" element={<CounselerList />}></Route>
         <Route path="/history" element={<History />}></Route>
         <Route path="/history/:chat_id" element={<RoomInfo />}></Route>
         <Route path="/ui/chatUser" element={<ChatUser />}></Route>
         <Route path="/ui/mypage" element={<MyPage />}></Route>
         <Route path="/signup" element={<Signup />} />
    </Routes>
    </RecoilRoot>  
    </SocketContext.Provider>
    </>
  );
}

export default App;

const ChatHeader = styled.div`
  display: grid;
  background-color:#404240;
  place-items: center;
  font-size: 20px;
  height:30px;
  margin-bottom: 0px;
  color: grey;
  padding:5px;
  color: white;
`;