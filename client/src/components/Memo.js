import React, { useRef} from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';


function Memo({ socket, chat_id, cus_code, cnsr_code}) {  
    const inputRef = useRef();
    console.log("메모 작성");
    const sendMemo = async () => {
        const currentMemo = inputRef.current.value;
        if (currentMemo !== '') {
          //메시지 전송할때 데이터 규격 맞추기
          const memoData = {
            chat_id: chat_id,
            cnsr_code: cnsr_code,
            cus_code: cus_code,
            chat_memo: currentMemo
          };
          //send_message 이벤트로 메시지 데이터와 함께 메시지 전송 후 inpurRef 메시지입력창 초기화
          await socket.emit('event:save_memo', memoData);
   
          inputRef.current.value = '';
        }}
        return (
            <Container>
            <ConnectionBar>
                <TabMenu>
                  <li className='submenu'>
                    상담메모
                  </li>
                </TabMenu>
                <Input 
                    ref={inputRef}    
                />
                <Button onClick={() => sendMemo()}>작성</Button>
            </ConnectionBar>
            </Container>
          );
        }
        
       

export default Memo;


const Container = styled.div`
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center; /* 수평 가운데 정렬 */
  background
`;
const ConnectionBar = styled.div`
display: flex;
flex-direction: column;
position:relative;
height:400px;
background-color: #fafafa;
border: 1px solid #dddddd;
min-width:150px;
margin-top:30px;
border-radius: 5px;
width: 100%;
align-items: center; /* 수직 가운데 정렬 */
`

const TabMenu = styled.ul`
  background-color: #d2d0d0;
  font-weight: bold;
  color: #3a78c3;
  margin: 0px;
  padding: 10px;
  font-size: 15px;
  width: 96%;

  .submenu {
    // 기본 Tabmenu 에 대한 CSS를 구현
      display: flex;
      width: calc(100% /3);
      padding: 6px 6px 6px 0px;
      font-size: 18px;
      transition: 0.5s;
      flex-grow: 1;
      justify-content: center;
    }
`;

const Input = styled.textarea`
  flex: 1;
  height: 250px;
  width : 80%;
  margin : 20px;
  
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #FFEFC7; /* 배경색을 노란색으로 지정 */
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #5F7571;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  width:70px;
  justify-content: center;
  display: flex; /* 버튼 내부 내용물을 가운데 정렬 */
  align-items: center; /* 버튼 내부 내용물을 가운데 정렬 */
  margin-bottom: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;