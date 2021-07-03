import React from "react";
import styled from "styled-components";

export const InfoButton = () => {
    return (
        <Outer title="info"><Inner>i</Inner></Outer>
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
`

const Inner = styled.span`
    position: relative;
    left: 0.3em;
    bottom: 0.15em;
`