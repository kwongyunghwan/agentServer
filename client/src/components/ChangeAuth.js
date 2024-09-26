import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useRecoilState } from "recoil";
import { cnsrInfoState } from "../context/atoms/cnsrInfo";

function AuthPopup(props) { //권한변경 팝업
    const [role, changeRole] = useState(''); // 권한
    const [cnsrInfo, setCnsrInfo] = useRecoilState(cnsrInfoState);

    const updateCnsrRole = async () => { //권한 변경
        console.log(`props >>> ${JSON.stringify(props)}`)
        try {
            const res = await axios.patch("http://localhost:4000/updateRole", {
                cnsrCode: props.email,
                role: role
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`update counseler role success >> ${JSON.stringify(res.data)}`);

            if(res.data.success == true){
                alert('상담원 권한이 변경되었습니다.');
                props.closePopup('change', role);
                if(cnsrInfo.cnsr_code == props.email){
                    setCnsrInfo({cnsr_code: props.email, cnsr_role:role}); //admin 하위 권한으로 변경시 관리자기능 비활성화

                    if(role != 'admin'){ 
                        window.location.replace('/ui/home');
                    }
                }
            }

        } catch (err) {
            console.error(`update counseler role fail >> ${err}`);
        }
    }

    return (
        <PopupContainer>
            <TitleBox className='popup'>권한 관리</TitleBox>
            <InfoContainer>
                <Circle></Circle><Dot className={props.status == '온라인' ? 'on' : ''}></Dot>
            </InfoContainer>    
            <TextContainer>
                <Text>{props.name}</Text>
                <Text>{props.role}</Text>
            </TextContainer>
            <RadioContainer>
                <label>admin<input type="radio" value="admin" name="role" onClick={()=>changeRole('admin')} defaultChecked={props.role == 'admin' ? true : false}/></label>
                <label>agent<input type="radio" value="agent" name="role" onClick={()=>changeRole('agent')} defaultChecked={props.role == 'agent' ? true : false}/></label>
                <label>reader<input type="radio" value="reader" name="role" onClick={()=>changeRole('reader')} defaultChecked={props.role == 'reader' ? true : false}/></label>
            </RadioContainer>
            <ButtonContainer>
                <PopupButton onClick={updateCnsrRole}>변경</PopupButton>
                <PopupButton onClick={props.closePopup}>닫기</PopupButton>
            </ButtonContainer>
        </PopupContainer>
    )
}

export default AuthPopup;

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
    width: 100%;
    box-sizing: border-box;
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

const RadioContainer = styled.div`
    padding: 1em;
    position: absolute;
    bottom: 4em;
    width: 100%;
    box-sizing: border-box;
`;