import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from "recoil";
import { messageListState } from "../context/atoms/messageList";
import { messageListSortState } from "../context/selectors/messageSortList";
//서버와 연결한 socket변수와 이름, 룸id를 파라미터로 함수를 실행시킴
function Chat({ socket, cnsr_code, cus_code, chat_id}) {
  const inputRef = useRef();
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const sortList = useRecoilValue(messageListSortState(chat_id));
 
  //date 객체가 utc 기준이라 한국시간으로 만들기위한 offset 변수를 만듬
  const offset = 1000 * 60 * 60 * 9;
  const messageBottomRef = useRef(null);

  const exit = () => {
    socket.emit("event:leave_room", {chat_id:chat_id, status:9});
        // 방 정보 삭제
    localStorage.removeItem('currentChat');
    window.location.reload("/ui/home");
  }
  // sendMessage는 비동기작업으로 해당 값들을 받음
  const sendMessage = async () => {
    const currentMsg = inputRef.current.value;
    if (currentMsg !== '') {
      //메시지 전송할때 데이터 규격 맞추기
      const messageData = {
        chat_id: chat_id,
        cus_code: cus_code,
        cnsr_code: cnsr_code,
        msg: {
          "at" : new Date(Date.now()+ offset),
          "time": new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
          "contents": {
            "type": "text",
            "text": currentMsg
          }
        },
        status : 2,
      };
      //send_message 이벤트로 메시지 데이터와 함께 메시지 전송 후 inpurRef 메시지입력창 초기화
      await socket.emit('event:send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      inputRef.current.value = '';
    }
  };
  // 실시간으로 메시지 받으며 setMessageList에 해당 데이터 계속 추가
  useEffect(() => {
    const handelMessageReceive = (data)=>{
      setMessageList((list) => [...list, data]);
      console.log('sort>>>>>>>>>>>>', sortList);
    }

    socket.on('event:receive_message',handelMessageReceive);

    return () => {
      socket.off('event:receive_message', handelMessageReceive);
    };
  }, [socket, setMessageList, sortList]);
  
  // 스크롤을 가장 아래쪽에 위치할때까지 부드럽게 스크롤함
  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  return (
    <div style={{width:'100%', margin:'30px'}}>
   <RoomContainer>
      <RoomHeader>
        <RoomTitle>{chat_id.substring(0,12)}번 채팅방<RoomExit onClick={exit}>X</RoomExit></RoomTitle>
      </RoomHeader>
      <RoomBody>
        <MessageBox>
          {sortList.map((messageContent) => {
            return (
              <Message
                messageContent={messageContent}
                cus_code={cus_code}
                status={messageContent.status}
              />
            );
          })}
          <div ref={messageBottomRef} />
        </MessageBox>

      </RoomBody>
      <ChatInputBox>
        <ChatInput
          ref={inputRef}
          type='text'
          placeholder='메세지를 입력해주세요'
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <ChatButton onClick={sendMessage}>▹</ChatButton>
      </ChatInputBox>
    </RoomContainer>
    </div>
  );
}

export default Chat;

const RoomContainer = styled.div`
  width: 50%;
  max-width: 400px;
  @media screen and (max-width: 550px) {
    width: 90%;
  }
  height: 440px;
`;

const RoomHeader = styled.div`
  height: 40px;
  border-radius: 6px 6px 0 0;
  background: #c9e1e0;
  position: relative;
`;
const RoomExit = styled.button`
  float:right;
  width:30px;
  position: relative;
  background: #c9e1e0;
  color: white;
  font-weight: bold;
  height:40px;
  border: 0;

  &:hover{
    background: #7cbcaf;
  }
`
const RoomTitle = styled.p`
  margin: 0;
  display: block;
  padding: 0 1em 0 2em;
  color: black;
  font-weight: 700;
  line-height: 45px;
`;

const RoomBody = styled.div`
  height: 400px;
  border: 1px solid #d6e7e8;
  background: #ddeeee;
  position: relative;
`;

const MessageBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 5px;
`;

const ChatInputBox = styled.div`
  height: 40px;
  border: 1px solid #d6e7e8;
  border-top: none;
  display: flex;
  border-radius: 0 0 6px 6px;
`;

const ChatInput = styled.input`
  height: 100%;
  flex: 85%;
  border: 0;
  padding: 0 0.7em;
  font-size: 1em;
  outline: none;
  background: transparent;
`;

const ChatButton = styled.button`
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex: 15%;
  height: 100%;
  background: transparent;
  outline: none;
  font-size: 25px;
  transition: all 0.5s;
  color: lightgray;
  &:hover {
    background: #7cbcaf;
    transition: all 0.5s;
  }
  &:active {
    background: darkblue;
    /* transition: all 0.5s; */
    font-size: 0.5rem;
  }
`;
