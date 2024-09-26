import React from 'react';
import styled from "styled-components";

const Modal = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header, onSubmit, newPhoneNum, setNewPhoneNum } = props;

    const addHyphen = (target) => {
        target.value = target.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(-{1,2})$/g, "");
    };

    const handleChange = (event) => {
        addHyphen(event.target);
        setNewPhoneNum(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit();
    };

    return (
        <ModalWrapper open={open}>
            {open && (
                <ModalContent>
                    <ModalHeader>
                        <p className='largeText'>{header}</p>
                        <CloseButton onClick={close}>X</CloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <input
                            type="tel"
                            value={newPhoneNum}
                            onChange={handleChange}
                            maxLength={13}
                            placeholder="변경할 전화번호 입력"
                        />
                        <button className='change' onClick={handleSubmit}>변경</button>
                    </ModalBody>
                </ModalContent>
            )}
        </ModalWrapper>
    );
};

// 스타일
const ModalWrapper = styled.div`
    display: ${({ open }) => (open ? 'flex' : 'none')};
    position: fixed;
    top: 0;
    left : 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    justify-content: center;
    align-items: center;
`

const ModalContent = styled.section`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 15px;
    width: 30%;
    height: 22vh;
    border: 1px solid black;
`

const ModalHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background-color: #404240;
    margin: -15px -15px 20px -15px;

    .largeText {
        font-weight: 700;
        font-size: larger;
        color: white;
        padding-left: 20px;
    }
`
const CloseButton = styled.button`
    margin-right: 5%;
    width: 35px;
    height: 4vh;
    background-color: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 80px;
    cursor: pointer;
    font-size: x-large;

`

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;

    input {
        margin: 20px 15px 20px 15px;
        height: 4vh;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 20px;
        font-size: medium;
        font-weight: 600;
        background-color: #E8E8E8;
        border: 1px solid grey;
        border-radius: 3px;
    }

    button.change {
        width: 20%;
        height: 3.5vh;
        margin: 3% 40% 0 40%;
        font-size: medium;
        font-weight: 700;
        background-color: #404240;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: black;
        color: #e8e8e8;
    }

    @media screen and (max-width: 800px) {
        button.change {
            width: 100%;
        }
    }
`

export default Modal;
