import styled from 'styled-components';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function RoomInfo({ chat_id }) {
  const [roomInfoList, setRoomInfo] = useState(null);
  const roomBodyRef = useRef(null);

  useEffect(() => {
    fetchRoomInfo();
  }, [chat_id]);

  useEffect(() => {
    // 채팅 내용 맨 아래로 자동 스크롤
    if (roomBodyRef.current) {
      const roomBody = roomBodyRef.current;
      roomBody.scrollTo({
        top: roomBody.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [roomInfoList]);

  const fetchRoomInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/history/${chat_id}`);
      setRoomInfo(response.data);
    } catch (error) {
      console.error('Error fetching room info:', error);
    }
  };

  if (!roomInfoList) {
    return <div>방정보 찾을 수 없음</div>;
  }

  return (
    <MainContent>
    <ContentContainer>
    <h3 style={{ textAlign: 'left' }}>상담 이력</h3>
    <RoomHeader>
      <RoomTitle>{roomInfoList[0].chat_id.substring(0,12)}번 채팅방</RoomTitle>
    </RoomHeader>
    <ChatContainer>
    <RoomBody ref={roomBodyRef}>
        {roomInfoList.map((roomInfoList, index) => (
        <MessageContainer who={roomInfoList.cnsr_code ? 'me' : 'other'}>
          <div key={index}>
        <MessageSub who={roomInfoList.cnsr_code ? 'me' : 'other'}>
          <Author>{roomInfoList.send_user}</Author>
        </MessageSub>
        <MessageBody who={roomInfoList.cnsr_code ? 'me' : 'other'}>
          <MessageText>{roomInfoList.chat_message}</MessageText>
        </MessageBody>
        <MessageSub who={roomInfoList.cnsr_code ? 'me' : 'other'}>
          <Time>{new Date(roomInfoList.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Time>
        </MessageSub>
          </div>
        </MessageContainer>
        ))}      
    </RoomBody>   
    </ChatContainer>
    </ContentContainer>

    <HistoryContentContainer>
    <RoomInfoTable>
          <tbody>
            <tr>
              <td>방번호</td>
              <td>{roomInfoList[0].chat_id}</td>
            </tr>
            <tr>
              <td>참여자</td>
              <td>{[...new Set(roomInfoList.map(item => item.send_user))].join(', ')}</td>
            </tr>
            <tr>
              <td>등록일시</td>
              <td>{new Date(roomInfoList[0].sent_at).toLocaleString('ko-KR')}</td>
            </tr>
            <tr>
              <td>상담메모</td>
              <td>{roomInfoList[0].chat_memo ? roomInfoList[0].chat_memo : '내역 없음'}</td>
            </tr>
          </tbody>
        </RoomInfoTable>
    </HistoryContentContainer>      
    </MainContent>
  );
}

export default RoomInfo;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
  padding: 0 10px;
  box-sizing: border-box;
`;

const MessageBody = styled.div`
  min-height: 40px;
  max-width: 550px;
  border-radius: 5px;
  color: ${({ who }) => (who === 'me' ? 'white' : 'black')};
  display: flex;
  align-items: center;
  margin: 0 3px;
  padding: 2px 5px;
  overflow-wrap: break-word;
  word-break: break-all;
  justify-content: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
  background-color: ${({ who }) => (who === 'me' ? '#25997e' : 'white')};
`;

const MessageText = styled.p`
  margin: 5px;
`;

const MessageSub = styled.div`
  display: flex;
  font-size: 12px;
  justify-content: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
  margin-right: ${({ who }) => (who === 'me' ? '10px' : '')};
  margin-left: ${({ who }) => (who === 'me' ? '' : '10px')};
`;

const Time = styled.p`
  margin-top: 5px;
  margin-right: 5px;
`;

const Author = styled.p`
  margin-top: 5px;
  margin-left: 5px;
  font-weight: bold;
`;

const HistoryContentContainer = styled.div`
  display: flex;
  width: 70%;
  padding: 0 5px;
  box-sizing: border-box;
  flex-direction: column;
`;

const RoomInfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 60px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;
  border-radius: 5px;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
  }

  td:first-child, th:first-child {
    padding-left: 20px;
  }

  td:last-child, th:last-child {
    padding-right: 20px;
  }
`;

const ChatContainer = styled.div`
 width: 70%;
 height: 400px;
 background-color: #c9e1e0;
 overflow-y: auto;
`

const MainContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 800px;
    padding: 30px 50px 0px 50px;
    margin: 30px;
    border: 1px solid #ccc;
    box-shadow: -2px 4px 5px #ccc;
    background-color: #f4f3f3;
    color: #000;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: row;

    .title {
        font-weight: bold;
        font-size: large;
        padding-left: 30px;
        border: 1px solid #ccc;

        p {
            text-align: left;
        }
    }

    .info {
        height: 24vh;
        justify-content: center;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 30px;

        padding: 10px;
        border: 1px solid #000;

        .profile {
            width: 150px; /* 이미지 크기 조절 */
            height: 150px; /* 이미지 크기 조절 */
            border-radius: 50%;
            border: 1px solid black;
            overflow: hidden;
            display: flex;
            justify-content: center; /* 가로 중앙 정렬 */
            align-items: center; /* 세로 중앙 정렬 */
            img {
                width: 80%;
                height: auto;
                object-fit: cover;
            }
        }

        .details {
            width: 70%;
            height: 100%;
            margin-top: 5%;
            margin-left: 5%;
            display: flex;
            flex-direction: column;
            jutify-content: space-between;

            .infoBox {
                width: 400px;
                border: 1px solid #ccc;
                text-align: left;

                p {
                    display: flex;
                    margin-bottom: 5px;
                    padding-left: 10%;
                    padding-bottom: 10px;
                }
            }

            button {
                margin-left: 50%;
                background-color: #d4d4d4;
                border: none;
                border-radius: 5px;
                font-weight: 900;
                cursor: pointer;
            }

            button:hover {
                background-color: #b0b0b0;
            }

            .emailBox {
                width: 400px;
                border: 1px solid #ccc;
                margin-top: 10px;

                p {
                    text-align: left;
                    padding-left: 10%;
                }
            }
        }
    }

    .titleHistory {
        font-weight: bold;
        font-size: large;
        padding-left: 10px;
        border: 1px solid #ccc;
    }

    .history {
        margin-top: 20px;

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;

            th,
            td {
                border: 1px solid #000;
                padding: 8px;
            }

            th {
                background-color: #404240;
                color: #fff;
            }
        }
    }

    .largeText {
        font-size: large;
        font-weight: bold;
    }
`;

const RoomHeader = styled.div`
  height: 40px;
  width: 70%;
  background: #c9e1e0;
  position: relative;
  top: 0;
  z-index: 1;
`;

const RoomTitle = styled.p`
  margin: 0;
  display: block;
  padding: 0 1em 0 2em;
  color: black;
  font-weight: 700;
  line-height: 45px;
  text-align: left;
`;

const RoomBody = styled.div`
  height: 400px;
  background: #ddeeee;
  position: relative;
  overflow-y: auto;
`;

const ContentContainer = styled.div`
  flex-direction: column;
  width: 70%;
  justify-content: flex-start;
`