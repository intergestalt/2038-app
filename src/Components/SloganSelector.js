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

function nextId(list, index) {
  if (index !== undefined) {
    if (index++ > list.length) {
      return 0;
    } else {
      return index++;
    }
  }
}

function prevId(list, index) {
  if (index !== undefined) {
    if (index-- < 0) {
      return list.length;
    } else {
      return index--;
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
    y: (rowIndex + 1.5) * height,
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
    if (!first) return;
    if (rowList.length > 1 && dir === "Up") {
      setRowSelect(nextId(rowList, rowSelect));
    } else if (rowList.length > 1 && dir === "Down") {
      setRowSelect(prevId(rowList, rowSelect));
    } else if (colList.length > 1 && dir === "Right") {
      setColSelect(prevId(colList, colSelect));
    } else if (colList.length > 1 && dir === "Left") {
      setColSelect(nextId(colList, colSelect));
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData),
    ...config,
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setOffset(
      getScrollOffset(
        slideWidth,
        slideHeight,
        colList.findIndex((x) => x.id === colSelect),
        rowList.findIndex((y) => y.id === rowSelect),
      ),
    );
  }, [slideWidth, slideHeight, colList, rowList, colSelect, rowSelect]);

  return (
    <Fragment>
      <Info>
        w: {window.innerWidth}
        <br />
        h: {window.innerHeight}
        <br />
        x: {offset.x}
        <br />
        y: {offset.y}
      </Info>
      <Container
        {...handlers}
        offsetX={(colList.length + 0.5) * slideWidth}
        offsetY={(rowList.length + 0.5) * slideHeight}
      >
        {rowList.map((row, rIndex) =>
          colList.map((col, cIndex) => (
            <Slide
              className="sloganslide"
              data-id={col.id}
              key={col.id}
              active={rowSelect === rIndex && colSelect === cIndex}
              textColor={
                rowSelect === rIndex && colSelect === cIndex
                  ? activeColor
                  : "white"
              }
              onClick={() => {
                setRowSelect(rIndex);
                setColSelect(cIndex);
                // setCurrentSloganId(moveToId(slogans, id, currentSloganId))
              }}
              width={slideWidth}
              height={slideHeight}
              x={(cIndex - colSelect + 0.5) * slideWidth}
              y={(rIndex - rowSelect + 1) * slideHeight}
            >
              <Cage
                dangerouslySetInnerHTML={{ __html: slideContents(row, col) }}
              />
              {/* {slideContents(row, col)} */}
            </Slide>
          )),
        )}
      </Container>
    </Fragment>
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
`;

const Slide = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  display: flex;
  justify-content: center;
  font-size: 2rem;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  padding: 1em auto;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: color 0.3s 0.1s;
  transition: top 0.3s;
  transition: left 0.3s;
  color: ${({ textColor }) => textColor};
  vertical-align: middle;
  border-top: 1px lightblue solid;
  border-bottom: 1px white solid;
`;

const Cage = styled.p`
  text-align: center;
  margin: auto;
  word-wrap: break-word;
`;

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border: red 1px solid;
  transform: translate(
    calc(50vw - ${({ offsetX }) => offsetX}px),
    calc(50vh - ${({ offsetY }) => offsetY}px)
  );
`;

const Info = styled.div`
  padding: 8px;
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: small;
`;
