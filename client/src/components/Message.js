import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export const Message = (props) => {
  const messageContent = props.messageContent;
  const cus_code = props.cus_code;
  const status = props.status;
  const [who, setWho] = useState('me');
  // 메시지 값에서 cus_code로 자기가 보낸 메시지인지 상대 메시지인지 구분함
  useEffect(() => {
    cus_code === messageContent.cus_code ? setWho('me') : setWho('other');
  }, [props, cus_code, messageContent.cus_code]);

  return (
    <div>
    {status === 1 || status === 2 ? 
    <MessageContainer who={who}>
      <div>
        <MessageSub who={who}>
          <Author>{messageContent.cus_code}</Author>
        </MessageSub>
        <MessageBody who={who}>
          <MessageText>{messageContent.msg.contents.text}</MessageText>
        </MessageBody>
        <MessageSub who={who}>
          <Time>{messageContent.msg.time}</Time>
        </MessageSub>
      </div>
    </MessageContainer>
    : <MessageExitContainer>상담이 종료되었습니다.</MessageExitContainer>}
    </div>
  );
};
const MessageExitContainer = styled.div`
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #E2E2E2;
  justify-content: center;
  margin-top: 10px;
  height:20px;
  font-size:14px;
`;
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
  color:grey;
  font-weight: bold;
`;
