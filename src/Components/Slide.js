import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Slide = ({
  children,
  id,
  width = 300,
  height = 150,
  row,
  column,
  active,
  backgroundColor,
  onClick,
  activate,
  addToIO,
}) => {
  const ref = useRef();
  useEffect(() => {
    addToIO(ref.current);
  }, [addToIO]);
  return (
    <Container
      className="sloganslide"
      ref={ref}
      id={id}
      row={row}
      column={column}
      active={active}
      textColor={active ? "red" : "white"}
      backgroundColor={backgroundColor}
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
  /* width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`}; */
  vertical-align: middle;
  text-align: center;
  font-size: 2vh;
  white-space: pre-wrap;
  border: 1px grey solid;
  scroll-snap-align: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ textColor }) => textColor};
  grid-column-start: ${({ column }) => column};
  grid-row-start: ${({ row }) => row};
`;
