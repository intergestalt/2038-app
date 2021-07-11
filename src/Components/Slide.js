import React, { useRef } from "react";
import styled from "styled-components";

const Slide = ({
  children,
  id,
  width,
  height,
  row,
  column,
  active,
  activeColumn,
  currentColor,
  onClick,
  activate,
}) => {
  const ref = useRef();
  return (
    <Container
      className="sloganslide"
      ref={ref}
      id={id}
      row={row}
      column={column}
      active={active}
      textColor={active ? currentColor : activeColumn ? "white" : "#666"}
      activeColumn={activeColumn}
      onClick={() => onClick()}
      width={width}
      height={height}
    >
      {children}
    </Container>
  );
};

export default Slide;

const Container = styled.div`
  user-select: none;
  box-sizing: border-box;
  width: ${({ width }) => width};
  height: ${({ height }) => height}; 
  vertical-align: middle;
  text-align: center;
  white-space: pre-wrap;
  border: 1px grey solid;
  scroll-snap-align: center;
  background-color: ${ ({ activeColumn }) => activeColumn ? "rgba(0, 0, 0, 0.3)" : "rgba(0,0,0,0.6)"};
  color: ${({ textColor }) => textColor};
  grid-column-start: ${({ column }) => column};
  grid-row-start: ${({ row }) => row};
  font-family: 'Haas', sans-serif;
  font-weight: bold;
  font-size: 6vw;
  line-height: 1.1;
  transition: background-color 0.3s 0.1s ${ ({ active }) => !active && ", color 0.3s 0.1s"};
  display: flex;
  justify-content: center;
  align-items: center;
`;
