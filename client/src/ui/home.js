import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import ChatHome from '../components/ChatHome';
//0508 관리자 기능 추가 -ge
import CounselerList from '../components/CounselerList';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { cnsrInfoState } from "../context/atoms/cnsrInfo";
import { SocketContext } from '../context/socket';
import Mypage from '../components/Mypage';
import ChatUser from './chatUser';
import History from '../ui/history';
import RoomInfo from '../components/RoomInfo'

function Home() {
  //0508 관리자 기능 추가 -ge
  const navigate = useNavigate();
  const location = useLocation();
  const cnsrInfo = useRecoilValue(cnsrInfoState);
  console.log(cnsrInfo);
  const [chatId, setChatId] = useState(null);
  const [currentMenu, clickMenu] = useState('상담');
  const socket = useContext(SocketContext);
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);

  const clickMenuEvent = (index) =>{
    setHistory(prevHistory => [...prevHistory, currentMenu]);
    clickMenu(index);
    window.history.pushState({ menu: index, chatId: null }, '', location.pathname);
  }

  const handleRoomClick = (chat_id) => {
    setHistory(prevHistory => [...prevHistory, currentMenu]);
    clickMenu('방 정보 조회'); // history.js에서 방 클릭 시 '방 정보 조회'로 변경
    setChatId(chat_id); // 클릭한 방 번호를 상태에 저장
    window.history.pushState({ menu: '방 정보 조회', chatId: chat_id }, '', location.pathname);
  };

  // 뒤로 가기 시 페이지 이동
  const handleBackButton = () => {
    if (history.length > 0) {
      const previousMenu = history[history.length - 1];
      setHistory(history.slice(0, -1));
      clickMenu(previousMenu);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      handleBackButton();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [history]);

  useEffect(() => {
    window.history.pushState(null, '', location.pathname);
  }, [currentMenu]);


  return (
    <HomeContainer>
        <Sidebar>
          <p style={{cursor:'pointer'}} onClick={()=>clickMenuEvent('상담')}>상담</p>
          {cnsrInfo.cnsr_role == 'admin' ? <p style={{cursor:'pointer'}} onClick={()=>clickMenuEvent('이력')}>이력</p> : null}
          <p style={{cursor:'pointer'}} onClick={()=>clickMenuEvent('마이페이지')}>마이페이지</p>
        </Sidebar>
        <MainContainer>
          <ContentHeader>
            {currentMenu}
          </ContentHeader>
        <ContentContainer>
        {currentMenu ==='상담' ? <ChatHome/>: ''}
        {currentMenu ==='이력' ? <><History onRoomClick={handleRoomClick}></History></>: ''}
        {currentMenu ==='방 정보 조회' ? <><RoomInfo chat_id={chatId}></RoomInfo></>: ''}
        {currentMenu ==='마이페이지' ? <Mypage onRoomClick={handleRoomClick} userData={userData} cnsrCode={cnsrInfo.cnsr_code} />: ''}
        {currentMenu ==='관리자 기능' ? <><ChatUser></ChatUser></>: ''}
        </ContentContainer>
          {cnsrInfo.cnsr_role == 'admin' ? 
            <AdminButton onClick={()=>clickMenuEvent('관리자 기능')}>관리자 기능</AdminButton>
          : null}
        </MainContainer>
    </HomeContainer>
  );
}

export default Home;
// 스타일 컴포넌트 npm으로 설치해야 사용가능 

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  min-height:893px;
  background: #fff;
  color: #212121;
  display: flex;
  text-align: center; 
  position: relative;
`;
const MainContainer = styled.div` 
  display: flex;
  flex-direction: column;
  color:white;
  height:100%;
  flex-grow: 1;
`;
const ContentHeader = styled.div`
  background-color:#404240;
  border: 1px solid grey;
  height: 40px;
  line-height: 40px;
  text-align: left;
  padding-left: 40px;
  font-size:15px;
`

const ContentContainer = styled.div` 
  display: flex;
  text-align: center;
  flex-direction: row;
  color:white;
  flex-grow: 1;
  flex-wrap: nowrap;
`;

const Sidebar = styled.div` 
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid grey;
  position: relative;
  color:white;
  background-color:#404240;
  width: 10%;
  min-width:10%;
`;


const AdminFuntion = styled.div`
  position: absolute;
  right: 20px;
  top: 10px;
  color: white;
  font-size: 12px;
  cursor: pointer;
`;

//0508 관리자 기능 추가 -ge
const AdminButton = styled.button`
  border: none;
  border-radius: 0.5em;
  width: 7em;
  height: 2em;
  background-color: #55a18f;
  position: absolute;
  top : 1%;
  right: 1%;
  color: #fff;
  cursor: pointer;
`;
