import React from "react";
import styled from "styled-components";

export const Slide = ({
  children,
  id,
  key,
  width = 300,
  height = 150,
  active,
  // textColor,
  backgroundColor,
  x = 0,
  y = 0,
  onClick,
}) => {
  return (
    <Container
      className="sloganslide"
      id={id}
      key={key}
      active={active}
      // textColor={textColor}
      backgroundColor={backgroundColor}
      onClick={() => onClick()}
      width={width}
      height={height}
      x={x}
      y={y}
    >
      {children}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  padding: 1em auto;
  white-space: pre-line;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: color 0.3s 0.1s;
  transition: top 0.1s;
  transition: left 0.1s;
  background-color: ${({ backgroundColor }) => backgroundColor};
  vertical-align: middle;
  border-top: 1px lightblue solid;
  border-bottom: 1px white solid;
  user-select: none;
`;
