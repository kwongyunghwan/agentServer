import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import icons from '../Icons';

function History({ onRoomClick }) {
  const [originHistoryData, setOriginalHistoryData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  // 페이징
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // 필드 데이터 정렬
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  // 검색
  const [search, setSearch] = useState('');

  useEffect(() => {
    // 상담 이력 데이터를 가져오는 함수 호출
    fetchHistoryData();
  }, []);
  
    // 상담 이력 데이터를 가져오는 함수
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/history');
        if (response && response.data && response.data.result) { // result 키 추가
          const groupedData = groupByRoom(response.data.result);
          setOriginalHistoryData(groupedData);
          setHistoryData(groupedData);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };
  
    // chat_id를 기준으로 데이터 그룹화
    const groupByRoom = (data) => {
      const grouped = {};
      data.forEach(item => {
          const createTime = new Date(item.sent_at);
          if (!grouped[item.chat_id]) {
              // 방 번호의 최초 생성 시간으로 시작시간과 종료시간 설정
              grouped[item.chat_id] = {
                  chat_id: item.chat_id,
                  send_user: item.cnsr_code ? item.send_user : '',
                  start_at: createTime,
                  end_at: createTime
              };
          } else {
              // 이미 생성된 방 번호인 경우, 종료시간을 업데이트
              grouped[item.chat_id].end_at = createTime;
              // cnsr_code가 있는 경우에만 send_user 업데이트
              if (item.cnsr_code) {
                grouped[item.chat_id].send_user = item.send_user;
              }
          }
      });
      // 시작일시를 기준으로 내림차순으로 정렬
      const sortedData = Object.values(grouped).sort((a, b) => b.start_at - a.start_at);
      return sortedData;
    };    
  
    // 페이징
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };  

    // 방 클릭
    const handleRoomClick = (chat_id) => {
      console.log(chat_id);
      onRoomClick(chat_id); // 클릭한 방 번호를 home으로 전달
    };

    // 필드 데이터 정렬
    const handleSort = (field) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      setSortField(field);
      setSortOrder(order);

      const sortedData = [...historyData].sort((a,b) => {
          if (order === 'asc') {
            return new Date(a[field]) - new Date(b[field]);
           } else {
            return new Date(b[field]) - new Date(a[field]);
           }
      });

      setHistoryData(sortedData);
    };

    // 검색
    const handleSearch = () => {
      const filteredData = originHistoryData.filter(item =>
        item.chat_id.toLowerCase().includes(search.toLowerCase()) ||
        item.send_user.toLowerCase().includes(search.toLowerCase())
      );
      setHistoryData(filteredData);
    };
  
    const handleKey = (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };

  return (
      <MainContent>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
            <StyledTh>
                방 번호 {sortField === 'chat_id' && (sortOrder === 'asc' ? '▲' : '▼')}
              </StyledTh>
              <StyledTh>
                상담원 {sortField === 'send_user' && (sortOrder === 'asc' ? '▲' : '▼')}
              </StyledTh>
              <StyledTh onClick={() => handleSort('start_at')}>
                시작일시 {sortField === 'start_at' && (sortOrder === 'asc' ? '▲' : '▼')}
              </StyledTh>
              <StyledTh onClick={() => handleSort('end_at')}>
                종료일시 {sortField === 'end_at' && (sortOrder === 'asc' ? '▲' : '▼')}
              </StyledTh>
            </tr>
          </thead>
          <tbody>
            {historyData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <tr key={index}>
                  <StyledTd>
                    <StyledLink onClick={() => handleRoomClick(item.chat_id)}>
                      {item.chat_id}
                    </StyledLink>
                  </StyledTd>
                  <StyledTd>{item.send_user}</StyledTd>
                  <StyledTd>{item.start_at.toLocaleString()}</StyledTd>
                  <StyledTd>{item.end_at.toLocaleString()}</StyledTd>
                </tr>
              ))}
          </tbody>
        </StyledTable>
        <SearchContainer>
        <SearchInput
          type="text"
          placeholder="방 번호 또는 상담원 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKey}
        />
        <SearchIcon onClick={handleSearch}>
          <icons.Search />
        </SearchIcon>
      </SearchContainer>   
        <PaginationWrapper>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={historyData.length}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </PaginationWrapper>
      </TableWrapper>
      </MainContent>
  );
}

export default History;

const TableWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledTable = styled.table`
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
`;

const StyledTh = styled.th`
  background-color: #404240;
  color: #fff;
  padding: 8px;
  border: 1px solid #000;
`;

const StyledTd = styled.td`
  padding: 8px;
  border: 1px solid #000;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  .pagination {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
  }

  .page-item {
    margin: 0 5px;
  }

  .page-link {
    color: #333;
    text-decoration: none;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }

  .page-link:hover {
    background-color: #f0f0f0;
  }

  .active .page-link {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }
`;

const StyledLink = styled(Link)`
  color: black; /* 링크의 텍스트 색상을 검정색으로 지정 */
`;

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
        padding-left: 30px;
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

const SearchContainer = styled.div`
  display: flex;  
  background: white;
  width: 30%;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
  border: 1px solid #cccccc;
  padding: 3px;
  &:focus-within {
    border: 2px solid #3a76a8ff;
  }
`;

const SearchInput = styled.input`
  display: flex;  
  width: 95%;
  flex-grow: 1;
  border: 1px solid #cccccc;
  border: none;
  outline: none;
`;

const SearchIcon = styled.div`
  cursor: pointer;
  margin-left: 10px;
`;