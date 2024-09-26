import React, { useState } from 'react';
import styled from 'styled-components';
import icons from '../Icons';

const ChatUserSearch = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const handleKey = (event) => {
    if (event.key === 'Enter') {
      onSearch(search);
    }
  };

  return (
    <SearchContainer>
      <icons.Search />
      <SearchInput
        type="text"
        placeholder="상담원 검색"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKey}
      />
    </SearchContainer>
  );
};

export default ChatUserSearch;

/* 스타일 컴포넌트 */
const SearchContainer = styled.div`
  display: flex;  
  margin-left: 40px;
  margin-right: 40px;
  background: white;
  justify-content: flex-end;
  align-items: center;
  border: 1px solid #cccccc;
  padding: 0px 0px 0px 0px;
  &:focus-within {
    border: 2px solid #3a76a8ff;
  }
`;

const SearchInput = styled.input`
  display: flex;  
  width: 95%;
  padding: 10px 0px;
  flex-grow: 1;
  border: 1px solid #cccccc;
  border: none;
  outline: none;
`;
