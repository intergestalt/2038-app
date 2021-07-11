import React from "react";
import styled from "styled-components";

export const InfoButton = ({type, onClick}) => {
    const letter = type === "close" ? "x" : "i"
    return (
        <Outer title="info" onClick={onClick}>
            <Inner>
                {letter}
            </Inner>
        </Outer>
    );
};

const Outer = styled.span`
    border: 2px solid white;
    border-radius: 50%;
    width: 1.2em;
    height: 1.2em;
    color:white;
    font-family: 'Roboto Mono', monospace;
    font-size: 20px;
    display: inline-flex;
    cursor: pointer;
`

const Inner = styled.span`
    position: relative;
    left: 0.3em;
    bottom: 0.15em;
`