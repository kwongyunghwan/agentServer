import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // 회원가입 처리 함수
  const handleSignup = async (e) => {
    e.preventDefault();
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex = /^\d{3}-\d{4}-\d{4}$/;
   
    if (!emailRegex.test(email)) {
      setErrorMsg('유효한 이메일을 입력해주세요.');
      return;
    }
   
    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
      setErrorMsg('휴대폰 번호 형식이 올바르지 않습니다.')
      return;
    }
   
    if (email && password && name) {
      let body = {
        email: email,
        password: password,
        name: name,
        phoneNumber: phoneNumber
      };
   
      try {
        console.log("보낸 데이터: ", body);
   
        const res = await axios.post('http://localhost:4000/signup',null, {params:body});
   
        console.log("서버 응답: ", res.data);
   
        if (res.data.resultCode === 'SUCCESS') {
          alert('회원가입 성공!');
          navigate('/');  // 회원가입 후 메인 페이지로 이동
        }else{
          setErrorMsg('회원가입 오류');
        }
      } catch (error) {
        if(error.response.status == 400){
          setErrorMsg('이미 사용중인 이메일 입니다.');
          console.error('이메일 오류:', error);
        }else{
          setErrorMsg('서버 오류가 발생했습니다.');
          console.error('회원가입 오류:', error);
        }
      }
    } else {
      setErrorMsg('모든 값을 입력해주세요.');
    }
  };

  // 취소 버튼을 누르면 홈 페이지로 이동
  const goBack = () => {
    navigate('/');  
  };

  const addHyphen = (target) => {
    const value = target.value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3') 
      .replace(/(-{1,2})$/g, ''); 
    setPhoneNumber(value); 
  };

  return (
    <SignupApp>
      <SignupContainer>
        <SignupTitle>회원가입</SignupTitle>
        <SignupInput
          type='text'
          placeholder='아이디(이메일)를 입력해주세요'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SignupInput
          type='text'
          placeholder='이름을 입력해주세요'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
          <SignupInput
          type='text'
          placeholder='휴대폰 번호를 입력해 주세요(-) 포함'
          value={phoneNumber}
          onChange={(e) => addHyphen(e.target)}
        />
        <SignupInput
          type='password'
          placeholder='비밀번호를 입력해주세요'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SignupInput
          type='password'
          placeholder='비밀번호 확인'
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <ErrorMessage>{errorMsg}</ErrorMessage>
        <ActionButton onClick={handleSignup}>회원가입</ActionButton>
        <ActionButton onClick={goBack}>취소</ActionButton>
      </SignupContainer>
    </SignupApp>
  );
}

export default Signup;

// 스타일 컴포넌트 설정
const SignupApp = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff;
  color: #212121;
  display: flex; 
  justify-content: center; 
  align-items: flex-start; 
  padding-top: 50px; 
`;

const SignupContainer = styled.form`
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 0px solid grey;
  border-radius: 6px;
  padding: 10px;
  width: 300px;
`;

const SignupTitle = styled.h3`
  font-size: 30px;
  margin-bottom: 10px;
  color: grey;
`;

const SignupInput = styled.input`
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

const ActionButton = styled.button`
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
