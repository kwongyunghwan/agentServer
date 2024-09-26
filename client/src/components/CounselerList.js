import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from "axios";

function CounselerList() {
    const [counselerList, SetCounselerList] = useState([]);
    const [popupStatus, SetPopupStatus] = useState(false);
    const [selectCnsr, ClickCnsr] = useState([]);

    //상담원 목록 조회
    const GetCounselerList = async () => {
        const resp = await (await axios.get('http://localhost:4000/counselerList')).data;
        console.log(resp)
        SetCounselerList(resp.result);
        const pngn = resp.pagination;

    }

    useEffect(() => {
        GetCounselerList(); 
    }, []);

    const OpenRolePopup = (name, role, status) => {
        SetPopupStatus(true);
        ClickCnsr({'name' : name, 'role' : role, 'status': status});
    }

    const CloseRolePopup = () => {
        SetPopupStatus(false);
        ClickCnsr([]);
    }

    return (
            <CounselerContainer>
                <HeaderContainer>
                    <TitleBox>상담원 목록</TitleBox>
                    <SearchInput type='text' placeholder='상담원 검색'></SearchInput>
                </HeaderContainer>
                <TableContainer>
                    <CounselerTable>
                        <tr>
                            <TdContents className='thumb'></TdContents>
                            <TdContents className='short'>이름</TdContents>
                            <TdContents>휴대폰 번호</TdContents>
                            <TdContents>이메일</TdContents>
                            <TdContents className='short'>총 세션 수</TdContents>
                            <TdContents className='short'>접속 여부</TdContents>
                            <TdContents>최초 접속 시간</TdContents>
                            <TdContents></TdContents>
                        </tr> 
                        {counselerList.map((list) => (
                            <tr>
                                <TdContents className='thumb'><Circle></Circle><Dot className={list.cnsr_loginYn == '온라인' ? 'on' : ''}></Dot></TdContents>
                                <TdContents className='short'>{list.cnsr_name}</TdContents>
                                <TdContents>{list.cnsr_phoneNum}</TdContents>
                                <TdContents>{list.cnsr_email}</TdContents>
                                <TdContents className='short'>{list.sessionCnt}</TdContents>
                                <TdContents className={list.cnsr_loginYn == '온라인' ? 'onShort' : 'short'}>{list.cnsr_loginYn}</TdContents>
                                <TdContents>{list.firstAccTime}</TdContents>
                                <TdContents><RoleUdBtn class='roleUpdateBtn' onClick={()=>OpenRolePopup(list.cnsr_name, list.cnsr_role, list.cnsr_loginYn)}>권한 관리</RoleUdBtn></TdContents>
                            </tr>
                        ))}
                    </CounselerTable>
                </TableContainer>
                {popupStatus ? (
                    <PopupContainer>
                        <TitleBox className='popup'>권한 관리</TitleBox>
                        <InfoContainer>
                            <Circle></Circle><Dot className={selectCnsr.status == '온라인' ? 'on' : ''}></Dot>
                        </InfoContainer>    
                        <TextContainer>
                            <Text>{selectCnsr.name}</Text>
                            <Text>{selectCnsr.role}</Text>
                        </TextContainer>
                        <ButtonContainer>
                            <PopupButton>변경</PopupButton>
                            <PopupButton onClick={CloseRolePopup}>닫기</PopupButton>
                        </ButtonContainer>
                    </PopupContainer>
                ) : null}
            </CounselerContainer>
    )
}

export default CounselerList;

const CounselerContainer = styled.div`
    width: 95%;
    min-height: 500px;
    overflow: hidden;
    margin: 1em auto;
    padding: 0.5em;
    border: 1px solid #333;
    box-sizing: border-box;
    color: #333;
`;
    
const HeaderContainer = styled.div`
    position: relative;
    width: 100%;
`;

const TitleBox = styled.div`
    text-align:left;
    border: 1px solid #333;
    box-sizing: border-box;
    width: 90%;
    height: 2em;
    margin: 0.5em;
    padding: 7px 0 0 10px;
    font-weight: 600;

    &.popup {
        width: 100%;
        margin: 0;
        padding: 5px 0 0 5px;
        font-weight: normal;
        background-color: #333;
        color: #fff;
    }
`;

const SearchInput = styled.input`
    text-align:left;
    border: 1px solid #333;
    width: 91%;
    height: 2em;
    margin: 0.5em;
    position : absolute;
    left: 0.1em;
`;

const TableContainer = styled.div`
    position: relative;
    top: 3em;
    left: 0.1em;
    width: 100%;
`;

const CounselerTable = styled.table`
    width: 95%;
    height: auto;
    padding: 0 1%;
`;
const TdContents = styled.td`
    width: 15%;
    height: 30px;
    text-align: left;

    &.thumb {
        width: 4.5%;
    }
    &.short {
        width: 10%;
    }
    &.onShort {
        width: 10%;
        color: #4ce14c;
    }
`;

const Circle = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: blue;
`;

const Dot = styled.div`
    width: 9px;
    height: 9px;
    border-radius: 9px;
    background: grey;
    position: relative;
    left 20px;
    top: -6px;

    &.on {
        background : #4ce14c;
    }
`;

const RoleUdBtn = styled.button`
    border: none;
    background-color: #55a18f;
    color: #fff; 
    width: 5em;
    height: 1.8em;
    border-radius: 0.7em;
    box-shadow : 1px 2px 4px 1px #777777; 
    cursor: pointer;
`;

const PopupContainer = styled.div`
    width: 30%;
    height: 200px;
    background-color: #fff;
    border: 1px solid #333;
    position: absolute;
    top: 30%;
    left: 40%;
`;

const InfoContainer = styled.div`
    width: 30%;
    position: absolute;
    top: 3.5em;
    left: 2em;
`;

const TextContainer = styled.div`
    width: 40%;
    position: absolute;
    top: 3em;
    left: 3em;
`;

const Text = styled.p`
    display: inline-block;
    margin-right: 1em;
`;

const ButtonContainer = styled.div`
    padding: 1em;
    position: absolute;
    bottom: 1em;
    left: 40%;
`;

const PopupButton = styled.button`
    border: none;
    width: 3em;
    height: 2em;
    border-radius: 0.5em;
    background-color: #333;
    margin: 0 0.3em;
    color: #fff;
    cursor: pointer;
`;