import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import icons from '../Icons';
import Search from '../components/ChatUserSearch';
import AuthPopup from '../components/ChangeAuth';

// const url = 'http://192.168.10.79:4000';
const url = 'http://localhost:4000';

const ChatUser = () => {
  const [users, setUsers] = useState([]); // 상담원 데이터
  const [search, setSearch] = useState(''); // 상담원 검색
  const [session, setSession] = useState([]); // 세션 수
  const [page, setPage] = useState(1); // 페이지네이션
  const [limit] = useState(6); // 페이지당 최대 상담원 수
  const [popupStatus, SetPopupStatus] = useState(false); //권한팝업상태
  const [selectCnsr, ClickCnsr] = useState([]); //선택 상담원
  const [updateFlg, SetFlg] = useState(''); //변경여부

  /* 상담원 데이터 조회 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await axios.get(`${url}/chatUser`);
        setUsers(users.data.result);

        // 세션 수 조회
        const sessionData = {};
        await Promise.all(
          users.data.result.map(async (user) => {
            const sessionResponse = await axios.get(`${url}/session/${user.cnsr_code}`);
            sessionData[user.cnsr_code] = sessionResponse.data.result.length;
          })
        );
        setSession(sessionData);
        setPage(1); // 페이지를 1로 초기화
        // const session = await axios.get(`${url}/session/${users.cnsr_code}`);
        // setSession(session.data.result.length);
      } catch (error) {
        console.error('데이터 조회 중 오류 발생:', error);
      }
    };
    
    fetchData();

    if(updateFlg){
      fetchData();
      SetFlg('');
    }
  }, [updateFlg]);

  /* 접속 시간 계산 */
  const diffTime = (nowTime) => {
    const milliSeconds = new Date() - nowTime;
    const seconds = milliSeconds / 1000;
    if (isNaN(seconds) || seconds < 0) return '접속 기록 없음';
    if (seconds < 60) return `방금 전`;
    const minutes = seconds / 60;
      if (minutes < 60) return `${Math.floor(minutes)}분 전`;
    const hours = minutes / 60;
      if (hours < 24) return `${Math.floor(hours)}시간 전`;
    const days = hours / 24;
      if (days < 7) return `${Math.floor(days)}일 전`;
    const weeks = days / 7;
      if (weeks < 5) return `${Math.floor(weeks)}주 전`;
    const months = days / 30;
      if (months < 12) return `${Math.floor(months)}개월 전`;
    const years = days / 365;
    return `${Math.floor(years)}년 전`;
  };

  /* 상담원 목록 페이징 */
  const filteredUsers = users.filter((user) =>
    user.cnsr_name.toLowerCase().includes(search.toLowerCase())
  );
  // const filteredUsers = users.filter((user) =>
  // user.cnsr_name.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = page * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const maxPage = Math.ceil(filteredUsers.length / limit);

  const handleClick = (page) => {
    if (page >= 1 && page <= maxPage) {
      setPage(page);
    }
  };
  // const handleClick = (page) => {
  //   setPage(page);
  // };

  const OpenRolePopup = (name, role, status, email) => { //권한변경 팝업 열
    SetPopupStatus(true);
    ClickCnsr({'name' : name, 'role' : role, 'status': status, 'email' : email});
  }

  function closePopup(flg, role){ //권한변경 팝업 닫기
    if(flg === 'change'){
      SetPopupStatus(false);
      ClickCnsr([]);
      SetFlg(true);
    }else{
      SetPopupStatus(false);
      ClickCnsr([]);
    }
  }

  return (
    <HomeContainer>
      <MainContainer>
        <ContentContainer>
          <Title>상담원 목록</Title>
          <Search onSearch={setSearch}/>
          <CounselorList>
            <CounselorTable>
              <thead>
              <tr>
                  <th></th>
                  <th>이름</th>
                  <th>휴대폰 번호</th>
                  <th>이메일</th>
                  <th>총 세션 수</th>
                  <th>접속 여부</th>
                  <th>최초 접속 시간</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
                {currentItems.map((chatUser) => (
                  <tr key={chatUser.cnsr_code}>
                  <td>
                    <CounselorState>
                      <Profile>
                        🙂
                      </Profile>
                      <State>
                        {chatUser.cnsr_loginYn === '온라인' ? <CircleGreen /> : <CircleGray />}
                      </State>
                    </CounselorState>
                  </td>
                  <td>{chatUser.cnsr_name ? chatUser.cnsr_name : 0}</td>
                  <td>{chatUser.cnsr_phnum ? chatUser.cnsr_phnum.slice(-4) : '-'}</td>
                  <td>{chatUser.cnsr_email ? chatUser.cnsr_email : 0}</td>
                  <td>{session[chatUser.cnsr_code] ? session[chatUser.cnsr_code] : 0}</td>
                  <td style={{ color: chatUser.cnsr_loginYn === '온라인' ? '#0cd746'  : '#9d9c9c' }}>
                    {chatUser.cnsr_loginYn ? chatUser.cnsr_loginYn : 0}</td>
                  <td>{diffTime(new Date(chatUser.login_at)) ? diffTime(new Date(chatUser.login_at)) : 0}</td>
                  <td><EditButton onClick={()=>OpenRolePopup(chatUser.cnsr_name, chatUser.cnsr_role, chatUser.cnsr_loginYn, chatUser.cnsr_email)}>권한 관리</EditButton></td>
                  </tr>
                ))}
              </tbody>
            </CounselorTable>
          </CounselorList>
          <Pagination>
            <PaginationButton onClick={() => handleClick(1)} disabled={page === 1}><icons.DoubleLeft /></PaginationButton>
            <PaginationButton onClick={() => handleClick(page - 1)} disabled={page === 1}><icons.Left /></PaginationButton>
            <div>{page}/{maxPage}</div>
            <PaginationButton onClick={() => handleClick(page + 1)} disabled={page === maxPage}><icons.Right /></PaginationButton>
            <PaginationButton onClick={() => handleClick(maxPage)} disabled={page === maxPage}><icons.DoubleRight /></PaginationButton>
            {/* <PaginationButton onClick={() => handleClick(1)}><icons.DoubleLeft /></PaginationButton>
            <PaginationButton onClick={() => handleClick(Math.max(page - 1, 1))}><icons.Left /></PaginationButton>
              <div>{page}/{maxPage}</div>
              <PaginationButton onClick={() => handleClick(Math.min(page + 1, maxPage))}><icons.Right /></PaginationButton>
            <PaginationButton onClick={() => handleClick(maxPage)}><icons.DoubleRight /></PaginationButton> */}
          </Pagination>
        </ContentContainer>
      </MainContainer>
      {popupStatus ? (<AuthPopup closePopup={closePopup} status={selectCnsr.status} name={selectCnsr.name} role={selectCnsr.role} email={selectCnsr.email}/>) : null}
    </HomeContainer>
  );
};

export default ChatUser;


/* 공통 컨테이너 */
const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  min-height:893px;
  background: #fff;
  color: #212121;
  display: flex;
  text-align: center; 
`;

const MainContainer = styled.div` 
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
  flex-grow: 1;
`;

const ContentContainer = styled.div`
  margin-left: 60px;
  margin-top: 20px;
  width: 90%;
  min-width:600px;
  height: 100%;
  flex-direction: column;
  background: #f4f3f3;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.2);
  color: black;
`;


const Title = styled.div`
  display: flex;
  margin: 40px;
  margin-right: 200px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #cccccc;
  padding: 15px;
  font-size: 19px;
  font-weight: bold;
`;


/* 상담원 목록 */
const CounselorList = styled.div`
  margin: 40px;
`;

const CounselorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    border-bottom: 1px solid #dddddd;
    font-size: 16px;
    color: #5d5959;
  }
  th, td {
    padding: 8px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
  }
`;

const CounselorState = styled.div`
  display: flex;
  position: relative;
  margin-right: -40px;
`;

const Profile = styled.div`
  font-size: 35px;
  `;

const State = styled.span`
  position: absolute;
  left: 33px;
  top: 14px;
`;

const CircleGreen = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  background: #0cd746;
`;

const CircleGray = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  background: #9d9c9c;
`;

const EditButton = styled.button`
  display: flex;
  margin: 0 auto;
  padding: 3px 9px;
  background: #7ac2b1;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.2);
`;

/* 페이징 */
const Pagination = styled.div`

  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  font-size: 17px;
  color: #4e4b4b;
`;

const PaginationButton = styled.button`
  text-align: center;
  padding: 0px 10px;
  cursor: pointer;
  background: #f4f3f3;
  color: black;
  border: none;
  outline: none;
  font-size: 25px;
  }
`;