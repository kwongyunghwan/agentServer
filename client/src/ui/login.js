import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { cnsrInfoState } from "../context/atoms/cnsrInfo";
function Login() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cnsrInfo, setCnsrInfo] = useRecoilState(cnsrInfoState);
  const navigate = useNavigate();
  

  const login = async(e) => {
    e.preventDefault();
    if (userId !== '' && userPw !== '') {
      let body = {
        id: userId,
        pw: userPw
      }
      await axios.post('http://localhost:4000/login',null,{params:body})
      .then((res=>{
        console.log(res.data);
        if(res.data.resultCode === 'SUCCESS'){
          setCnsrInfo({cnsr_code: userId, cnsr_role:res.data.result.cnsr_role, cnsr_name: res.data.result.cnsr_name});
          navigate('/ui/home');

        }else{
            setErrorMsg('아이디 혹은 비밀번호가 틀렸습니다.');
        }
        }))
      .catch((error) => {
        console.log(error);
        setErrorMsg('서버오류');
      })
    } else {
        setErrorMsg('아이디 혹은 비밀번호를 입력해주세요.');
      }
    };

  const goToSignup = () =>{
    navigate('/signup');
  }

  return (
    <ChatApp>
        <ChatContainer>
          <ChatTitle>상담원 로그인 창</ChatTitle>
          <ChatInput
            type='text'
            placeholder='아이디를 입력해주세요'
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
          <ChatInput
            type='password'
            placeholder='비밀번호를 입력해주세요'
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
          <ErrorMessage>{errorMsg}</ErrorMessage>
          
          <ChatButton onClick={login}>로그인</ChatButton>
          <ChatButton onClick={goToSignup}>회원가입</ChatButton>
        </ChatContainer>

    </ChatApp>
  );
}

export default Login;
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
  border: 0px solid grey;
  border-radius: 6px;
  padding: 10px;
  width: 280px;
`;
const ChatTitle = styled.h3`
  font-size: 30px;
  margin-bottom: 10px;
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
