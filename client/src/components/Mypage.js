import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Modal from "../ui/modal/modal";
import image from "../ui/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Pagination from 'react-js-pagination';
import { Link, useNavigate } from 'react-router-dom';

function MyPage({ cnsrCode, onRoomClick }) {
    const [profileImg, setProfileImg] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [cnsrData, setCnsrData] = useState(null);
    const [newPhoneNum, setNewPhoneNum] = useState("");
    // 상담이력
    const [chatMessages, setChatMessages] = useState([]);
    // 페이징 (react library로 변경)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        if (cnsrCode) {
            fetchCnsrInfo(cnsrCode);
        }
    }, [cnsrCode]);

    // 프로필 사진 설정
    const handleImgChange = async (event) => {
        const file = event.target.files[0];
        setProfileImg(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("cnsrCode", cnsrCode);

        try {
            const response = await axios.post(
                `http://localhost:4000/img/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            alert("프로필 사진이 변경되었습니다!");
            const imgUrl = response.data.imageUrl;

            setCnsrData((prevData) => ({ ...prevData, cnsr_img: imgUrl })); // 업로드 후 새로고침
        } catch (error) {
            console.error(`이미지 업로드 오류: ${error}`);
        }
    };

    const fetchCnsrInfo = async (cnsrCode) => {
        try {
            const response = await axios.get(
                `http://localhost:4000/cnsr/${cnsrCode}`,
            );
            const data = response.data.counselor;

            console.log(`img: ${data.cnsr_img}`);

            // 핸드폰 번호에 하이픈 추가
            const phoneNum = data.cnsr_phnum.replace(
                /(\d{3})(\d{4})(\d{4})/,
                "$1-$2-$3",
            );
            data.cnsr_phnum = phoneNum;

            setCnsrData(data);

            // 상담이력조회 추가
            setChatMessages(groupByRoom(response.data.chatMessages || []))
        } catch (error) {
            // console.log(`code : ${cnsrCode}`);
            console.error(`상담원 정보 로드 중 에러: ${error}`);
        }
    };

    // chat_id를 기준으로 데이터 그룹화
    const groupByRoom = (data) => {
        const grouped = {};
        data.forEach(item => {
            const createTime = new Date(item.sent_at);
            let userName = item.send_user;
            if (!grouped[item.chat_id]) {
                grouped[item.chat_id] = {
                    chat_id: item.chat_id,
                    send_user: userName,
                    start_at: createTime,
                    end_at: createTime
                };
            } else {
                grouped[item.chat_id].end_at = createTime;
            }
        });
        const sortedData = Object.values(grouped).sort((a, b) => b.start_at - a.start_at);
        return sortedData;
    };
    
    useEffect(() => {
        if (cnsrCode) {
            fetchCnsrInfo(cnsrCode, currentPage);
        }
    }, [cnsrCode, currentPage]);

    // 페이징
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
  
      // 방 클릭
      const handleRoomClick = (chat_id) => {
          console.log(chat_id);
          onRoomClick(chat_id); // 클릭한 방 번호를 home으로 전달
      };

    // 핸드폰 번호 변경 요청
    const handleChangePhoneNum = async () => {
        try {
            await axios.patch(
                "http://localhost:4000/change",
                {
                    cnsrCode: cnsrCode,
                    newPhoneNum: newPhoneNum,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            alert("전화번호 변경이 완료되었습니다!");

            setModalOpen(false);
            fetchCnsrInfo(cnsrCode, currentPage); // 번호 변경 후 업데이트
        } catch (error) {
            console.error(`전화번호 변경 요청 실패 : ${error}`);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <MainContent>
            {cnsrData && (
                <>
                    <div className="title">
                        <p>마이 페이지 </p>
                    </div>
                    <div className="info">
                        <div style={{ position: "relative" }}>
                            <div className="profile">
                            <img src={profileImg ? URL.createObjectURL(profileImg) : (cnsrData && cnsrData.cnsr_img ? cnsrData.cnsr_img : image)} alt="사진" />
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleImgChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            <label htmlFor="fileInput">
                                    <CameraIcon icon={faCamera} />
                            </label>
                        </div>
                        <div className="details">
                            <div className="infoBox">
                                <p className="largeText">
                                    {cnsrData.cnsr_name}
                                </p>
                                <p>
                                    {cnsrData.cnsr_phnum}
                                    <button onClick={openModal}>수정</button>
                                </p>
                            </div>
                            <div className="emailBox">
                                <p>{cnsrData.cnsr_email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="title">
                        <p>나의 상담 이력</p>
                    </div>
                    <div className="history">
                    <TableWrapper>
                    <StyledTable>
                    <thead>
                        <tr>
                        <StyledTh>방 번호</StyledTh>
                        <StyledTh>상담원</StyledTh>
                        <StyledTh>시작일시</StyledTh>
                        <StyledTh>종료일시</StyledTh>
                        </tr>
                    </thead>
                    <tbody>
                        {chatMessages
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((item, index) => (
                            <tr key={index}>
                            <StyledTd>
                                <StyledLink onClick={() => handleRoomClick(item.chat_id)}>
                                {item.chat_id}
                                </StyledLink>
                            </StyledTd>
                            <StyledTd>{cnsrData.cnsr_name}</StyledTd>
                            <StyledTd>{item.start_at.toLocaleString()}</StyledTd>
                            <StyledTd>{item.end_at.toLocaleString()}</StyledTd>
                            </tr>
                        ))}
                    </tbody>
                    </StyledTable>
                    <PaginationWrapper>
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={chatMessages.length}
                        onChange={handlePageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                    </PaginationWrapper>
                    </TableWrapper>
                    </div>
                    <Modal
                        open={modalOpen}
                        close={closeModal}
                        header="전화번호 수정"
                        onSubmit={handleChangePhoneNum}
                        newPhoneNum={newPhoneNum}
                        setNewPhoneNum={setNewPhoneNum}
                    ></Modal>
                </>
            )}
        </MainContent>
    );
}

// 스타일
const MainContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 850px;
    padding: 30px 50px 0px 50px;
    margin: 30px;
    border: 1px solid #ccc;
    box-shadow: -2px 4px 5px #ccc;
    background-color: #f4f3f3;
    color: #000;

    @media (max-width: 1200px) {
        width: 100%;
        padding: 50px;
        margin: 20px auto;
    }

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
        justify-content: center;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 30px;
        position: relative;
        padding: 10px;
        border: 1px solid #000;

        .profile {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 1px solid black;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 100%;
                height: auto;
                object-fit: cover;
            }
        }

        .details {
            width: 70%;
            height: 100%;
            margin: 5%;
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

    .pagination {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    }

    .pagination .button {
        font-weight: bold;
        background-color: transparent;
        border: none;
        curosr: pointer;
    }
`;

const CameraIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 75%;
    right: 5%;
    padding: 5%;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    background-color: rgba(117, 117, 117, 0.7);
    font-size: 1.5rem; 

    &:hover {
        background-color: rgba(71, 71, 71, 0.7);
        color: #e8e8e8;
    
    }
`;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 80px;

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

const StyledLink = styled.a`
  color: black; /* 링크의 텍스트 색상을 검정색으로 지정 */
  &:hover {
    cursor: pointer;
  }

`;

export default MyPage;
