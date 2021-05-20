import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

const config = {
  delta: 15, // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false, // preventDefault on touchmove, *See Details*
  trackTouch: true, // track touch input
  trackMouse: false, // track mouse input
  rotationAngle: 0, // set a rotation angle
};

function nextId(list, id) {
  const index = list.findIndex((x) => x.id === id);
  if (index !== undefined) {
    if (index < list.length - 1) {
      return list[index + 1].id;
    } else {
      return id;
    }
  }
}

function prevId(list, id) {
  const index = list.findIndex((x) => x.id === id);
  if (index !== undefined) {
    if (index > 0) {
      return list[index - 1].id;
    } else {
      return id;
    }
  }
}

function moveToId(list, targetId, currentId) {
  const targetIndex = list.findIndex((s) => s.id === targetId);
  const currentIndex = list.findIndex((s) => s.id === currentId);
  if (targetIndex > currentIndex) {
    return nextId(list, currentId);
  }
  if (targetIndex < currentIndex) {
    return prevId(list, currentId);
  }
  return currentId;
}

function getScrollOffset(width, height, colIndex, rowIndex) {
  const off = {
    x: (colIndex + 0.5) * width,
    y: (rowIndex + 0.5) * height,
  };
  console.log({ width, height, colIndex, rowIndex });
  console.log(off);
  return off;
}

export const SloganSelector = ({
  rowList = [{ id: 1 }],
  rowSelect,
  setRowSelect,
  colList = [{ id: 1 }],
  colSelect,
  setColSelect,
  slideContents,
  slideWidth = 300,
  slideHeight = 150,
  activeColor,
}) => {
  const handleSwipe = ({
    event, // source event
    initial, // initial swipe [x,y]
    first, // true for first event
    deltaX, // x offset (initial.x - current.x)
    deltaY, // y offset (initial.y - current.y)
    absX, // absolute deltaX
    absY, // absolute deltaY
    velocity, // √(absX^2 + absY^2) / time
    dir, // direction of swipe (Left|Right|Up|Down)
  }) => {
    console.log(dir, first);
    if (!first) return;
    if (rowList.length > 1 && dir === "Left") {
      setRowSelect(nextId(rowList, rowSelect));
    } else if (rowList.length > 1 && dir === "Right") {
      setRowSelect(prevId(rowList, rowSelect));
    } else if (colList.length > 1 && dir === "Up") {
      setColSelect(prevId(colList, colSelect));
    } else if (colList.length > 1 && dir === "Down") {
      setColSelect(nextId(colList, colSelect));
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData),
    ...config,
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setOffset(getScrollOffset(slideWidth, slideHeight, colSelect, rowSelect));
  }, [slideWidth, slideHeight, colSelect, rowSelect]);

  return (
    <Container {...handlers}>
      {rowList.map((row) => (
        <Row key={row.id} offset={offset}>
          {colList.map((col) => (
            <Slide
              className="slide"
              data-id={col.id}
              key={col.id}
              active={rowSelect === row.id && colSelect === col.id}
              textColor={
                rowSelect === row.id && colSelect === col.id
                  ? activeColor
                  : "white"
              }
              onClick={() => {
                setRowSelect(row.id);
                setColSelect(col.id);
                // setCurrentSloganId(moveToId(slogans, id, currentSloganId))
              }}
              width={slideWidth}
              height={slideHeight}
            >
              <Cage
                dangerouslySetInnerHTML={{ __html: slideContents(row, col) }}
              />
              {/* {slideContents(row, col)} */}
            </Slide>
          ))}
        </Row>
      ))}
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex: 1;
  justify-self: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  color: white;
  user-select: none;
  transition: transform 0.3s;
  transform: translate(
    (calc(50vw - ${({ offset }) => offset.x}px)),
    (calc(50vh - ${({ offset }) => offset.y}px))
  );
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  width: 300px;
  padding: 1em auto;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: color 0.3s 0.1s;
  color: ${({ textColor }) => textColor};
  vertical-align: middle;
`;

const Cage = styled.p`
  text-align: center;
  margin: auto;
  word-wrap: break-word;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
