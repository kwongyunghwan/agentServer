import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import { useRecoilValue } from "recoil";
import { cnsrInfoState } from "../context/atoms/cnsrInfo";
import { SERVER_URL } from '../config';
import Chat from './Chat';
import Memo from './Memo';

function ChatHome() {
  const [roomData, setRoomData] = useState([]);
  const [roomCheck, setRoomCheck] = useState(false);
  const [cus_code, setCus_code] = useState('');
  const [chat_id, setChat_id] = useState('');
  const [showChat, setShowChat] = useState(false);
  const cnsrInfo = useRecoilValue(cnsrInfoState);
  const [clickTab, setClickTab] = useState(0);
  const socket = useContext(SocketContext);

  const clickTabEvent = (index) =>{
    setClickTab(index)
  }

  useEffect(() => {

    // 저장된 방 정보 복원
    const savedChat = localStorage.getItem('currentChat');
    if (savedChat) {
        const { chat_id, cus_code, showChat } = JSON.parse(savedChat);
        setChat_id(chat_id);
        setCus_code(cus_code);
        setShowChat(showChat);
    }
    
    axios.get(`${SERVER_URL}/session`)
      .then((res=>{
        if(res.data.resultCode ==='SUCCESS' && res.data.result){
          setRoomData(res.data.result);
          setRoomCheck(true); 
        }else{
          setRoomCheck(false); 
        }
        }))
      .catch((error) => {
        console.log(error);
    })});
    
  const connectRoom = useCallback((chat_id)=>{
      setChat_id(chat_id);
      setCus_code(cnsrInfo.cnsr_name);
      socket.emit("event:open", { chat_id, cus_code: '상담원', cnsr_code: cnsrInfo.cnsr_code});
      setShowChat(true);

    // localStorage에 방 정보 저장
    localStorage.setItem('currentChat', JSON.stringify({
      chat_id: chat_id,
      cus_code: cnsrInfo.cnsr_name,
      showChat: true
  }));
  
  }, [socket, cnsrInfo.cnsr_code]);
  
  const showRoom = useCallback((chat_id)=>{
    setChat_id(chat_id);
    setShowChat(true);
    setCus_code(cnsrInfo.cnsr_name);
}, []);

  return (
      <><ChatContainer>
        {showChat && <Chat socket={socket} cnsr_code={cnsrInfo.cnsr_code} cus_code={cus_code} chat_id={chat_id} />}
        </ChatContainer>
        
        <div style={{ width:'500px',display: 'flex', flexDirection: 'column',  alignItems: 'flex-start', minHeight: '100vh' }}>
        <ConnectionBar>
        <TabMenu>
              <li className={0 === clickTab ? "submenu focused" : "submenu"}
              onClick={()=> clickTabEvent(0)}>대기({roomData.filter((e=>e.status===1)).length})</li>
              <li className={1 === clickTab ? "submenu focused" : "submenu"}
              onClick={()=> clickTabEvent(1)}>상담중({roomData.filter((e=>e.status===2)).length})</li>
        </TabMenu>
            <Desc>
              {!roomCheck ? '' : clickTab === 0 ? roomData
                  .filter((e=> e.status === 1))
                  .map((e,index)=>{
                    return(
                      <ConnectUser>
                        <ConnectUserButton onClick={()=>connectRoom(e.chat_id)}>
                      <ChatId>{e.chat_id.substring(0,17)}</ChatId>
                      <RoomDate>{new Date(e.created_at).getHours()}시 {new Date(e.created_at).getMinutes()}분 {new Date(e.created_at).getMinutes()}초 </RoomDate>
                      </ConnectUserButton>
                      </ConnectUser>
                    )
                  }): roomData
                  .filter((e=> e.status === 2))
                  .map((e,index)=>{
                    return(
                      <ConnectUser>
                      <ConnectUserButton onClick={()=>showRoom(e.chat_id)}>
                    <ChatId>{e.chat_id.substring(0,17)}</ChatId>
                    <RoomDate>{new Date(e.created_at).getHours()}시 {new Date(e.created_at).getMinutes()}분 {new Date(e.created_at).getMinutes()}초 </RoomDate>
                    </ConnectUserButton>
                    </ConnectUser>
                    )
                  })}
            </Desc>

        </ConnectionBar>

        <div style={{ width: '80%', marginTop: '50px' }}>
        {!showChat ? '' : 
        <Memo socket={socket} chat_id={chat_id} cus_code={cus_code}  cnsr_code={cnsrInfo.cnsr_code} />    
        }
        </div>
        </div>
        </>
  );
}

export default ChatHome;
// 스타일 컴포넌트 npm으로 설치해야 사용가능 

const ChatContainer = styled.div` 
  display: flex;
  text-align: left;
  min-width:400px;
  width: 70%;
  flex-grow: 1;
`;
const ConnectionBar = styled.div`
display: flex;
flex-direction: column;
position:relative;
text-align: center;
height:400px;
background-color: #fafafa;
border: 1px solid #dddddd;
min-width:150px;
margin-top:30px;
margin-right:30px;
border-radius: 5px;
width: 80%;
`

const TabMenu = styled.ul`
  background-color: #fafafa;
  font-weight: bold;
  display: flex;
  color: #3a78c3;
  flex-direction: row;
  
  margin: 0px;

  .submenu {
  // 기본 Tabmenu 에 대한 CSS를 구현
    display: flex;
    width: calc(100% /3);
    padding: 10px;
    font-size: 18px;
    transition: 0.5s;
    flex-grow: 1;
    background-color: #fafafa;
    justify-content: center;
  }

  .focused {
   //선택된 Tabmenu 에만 적용되는 CSS를 구현
    background-color: #d2d0d0;
    
  }

`;
const ConnectUser = styled.div`
  border-bottom:1px solid #e4e4e4;
  margin-top:5px;
  margin-bottom: 10px;
`
const ConnectUserButton = styled.button`
  border: 0px;
  height:50px;
  background-color:#fafafa;
`

const ChatId = styled.div`
  font-size:15px;
`
const RoomDate = styled.div`
  font-size: 12px;
  color: grey;
`
const Desc = styled.div`
  float:left;
  color:black;

`;