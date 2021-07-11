import React from "react";
import styled, { keyframes, css }  from "styled-components";

// flash box when trigger turns true

export const Flash = ({trigger, color}) => {
  return (
    <Container triggered={trigger} color={color}>
      {trigger ? "triggered" : "idle"}
    </Container>
  );
};

const flash = keyframes`
  0% {
      opacity:0.9;
  }
  100% {
      opacity: 0;
  }
`

const Container = styled.div`
  position: absolute;
  top:0;
  left:0;
  bottom:0;
  right:0;
  pointer-events: none;
  background-color: ${ ({ color }) => color };
  opacity: 0;
  animation: ${ ({ triggered }) => triggered ? flash : "none" };
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  z-index: 1;
`;

// ${ ({ triggered }) => triggered && `animation: ${flash};`}