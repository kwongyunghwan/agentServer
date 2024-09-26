import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const firstPage = () => {
        if (currentPage > 1) {
            onPageChange(1);
        }
    }

    const lastPage = () => {
        if (currentPage < totalPages) {
            onPageChange(totalPages);
        }
    }

    const decPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const incPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <PaginationContainer>
            <IconButton onClick={firstPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </IconButton>
            <IconButton onClick={decPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </IconButton>
            <span>{currentPage} / {totalPages}</span>
            <IconButton onClick={incPage} disabled={currentPage === totalPages}>
                <FontAwesomeIcon icon={faChevronRight} />
            </IconButton>
            <IconButton onClick={lastPage} disabled={currentPage === totalPages}>
                <FontAwesomeIcon icon={faAngleDoubleRight} />
            </IconButton>
        </PaginationContainer>
    );
}

const PaginationContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
`

const IconButton = styled.div`
    background-color: transparent;
    font-size: large;
    font-weight: bold;
    border: none;
    margin: 10px;
    padding: 5px;
    color: #000;
    cursor: pointer;

    svg {
        font-size: inherit;
    }
`

export default Pagination;
