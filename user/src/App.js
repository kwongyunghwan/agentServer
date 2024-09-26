import io from 'socket.io-client';
import axios from 'axios';
import { useState } from 'react';
import Chat from './components/Chat';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//socket 서버와 연결하기위해 아래 방식처럼 연결

const url = 'http://localhost:4000'
const socket = io.connect(url);

function App() {
  
  const [cus_code, setCus_code] = useState('');
  const [chat_id, setChat_id] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

    
  // 버튼 클릭시 새로고침 되는걸 막기위해 preventDefault를 호출
  const open = (e) => {
    e.preventDefault();
    /* 이름과 room번호가 공백이 아니라면 join_room 이벤트를 room과 username을 데이터에 실어서
     서버쪽에 전달시킴
      아니라면 사용자 이름과 입장할 방을 선택해달라는 문구 발생
     */
    if (cus_code !== '') {
      axios.get(`${url}/`)
      .then((res=>{
        if(res.data.resultCode ==='SUCCESS' && res.data.result){
          let room = uuidv4();
          socket.emit("event:open", { chat_id: room, cus_code });
          setShowChat(true);
          setChat_id(room);
          console.log('성공적으로 접속');
        }else{
          setErrorMsg('서버 연결이 정상적이지 않습니다.');
        }
        }))
      .catch((error) => {
        setErrorMsg('서버가 작동중이지 않습니다.');
        console.log(error);
      })
    } else {
      setErrorMsg('아이디 혹은 비밀번호를 입력해주세요.');
    }
  };

  //showchat이 true이면 로그인창이 뜨고 false이면 채팅방 화면이 뜨게 구성함
  return (
    <ChatApp>
     
      {!showChat ? (
        <ChatContainer>
          <ChatTitle>임시 클라이언트</ChatTitle>
          <ChatInput
            type='text'
            placeholder='사용할 이름을 입력해주세요'
            onChange={(e) => {
              setErrorMsg('');
              setCus_code(e.target.value);
            }}
          />
          <ErrorMessage>{errorMsg}</ErrorMessage>
          <ChatButton onClick={open}>접속</ChatButton>
        </ChatContainer>
      ) : (
        <Chat socket={socket} cus_code={cus_code} chat_id={chat_id} />
      )}
    </ChatApp>
  );
}

export default App;
// 스타일 컴포넌트 npm으로 설치해야 사용가능 
const ChatApp = styled.div`
  width: 100vw;
  height: 450px;
  background: #fff;
  color: #212121;
  display: grid;
  place-items: center;
`;

const ChatContainer = styled.form` 
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid grey;
  border-radius: 6px;
  padding: 10px;
  width: 280px;
`;
const ChatTitle = styled.h3`
  font-size: 30px;
  margin-bottom: 1rem;
  color: grey;
`;
const ChatInput = styled.input`
  height: 35px;
  margin: 7px;
  border: 1px solid grey;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
`;

const ErrorMessage = styled.p`
  color: red;
  height: 10px;
  font-size: 0.8rem;
`;

const ChatButton = styled.button`
  width: 200px;
  height: 50px;
  margin: 10px auto;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 16px;
  background: black;
  color: #fff;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    background: grey;
    transition: all 0.5s;
  }
  &:active {
    font-size: 0.8rem;
  }
`;
