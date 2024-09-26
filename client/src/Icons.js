import styled from 'styled-components';
import { CgSearch, CgMenu } from "react-icons/cg";
import { HiChevronLeft, HiChevronRight, HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { HiChatBubbleOvalLeft, HiUserCircle } from "react-icons/hi2";
import { FcOk, FcCancel } from "react-icons/fc";


const Icons = {
  Chat: styled(HiChatBubbleOvalLeft)`
    margin-left: 10px;
    margin-right: 10px;
    width: 20px;
    color: #27CE9C; 
    font-size: 20px;
    font-weight: bold;
  `,
  Menu: styled(CgMenu)`
    margin-left: 10px;
    margin-right: 10px;
    width: 20px;
    color: #27CE9C;
    font-size: 20px;
    font-weight: bold;
  `,
  Search: styled(CgSearch)`
    margin-left: 5px;
    margin-right: 5px;
    color: #27CE9C;
    font-size: 23px;
    font-weight: bold;
  `,
  User: styled(HiUserCircle)`
    margin-left: 10px;
    margin-right: 10px;
    width: 20px;
    color: #27CE9C;
    font-size: 20px;
    font-weight: bold;
  `,
  Left: styled(HiChevronLeft)`
    margin-right: 5px;
    font-size: 30px;
  `,
  Right: styled(HiChevronRight)`
    margin-left: 5px;
    font-size: 30px;
  `,
  DoubleLeft: styled(HiChevronDoubleLeft)`
    margin-right: 5px;
  `,
  DoubleRight: styled(HiChevronDoubleRight)`
    margin-left: 5px;
  `,
  Yes: styled(FcOk)`
    margin-right: 5px;
    font-size: 30px;
  `,
  No: styled(FcCancel)`
    margin-right: 5px;
    font-size: 30px;
  `,
};

export default Icons;