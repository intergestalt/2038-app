import React, { useState, useEffect } from "react";
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

function getScrollOffset(currentId) {
  const slides = document.getElementsByClassName("slide");
  let offset = 0;
  for (let i = 0; i < slides.length; i++) {
    //console.log(slides[i].getAttribute('data-id'));
    if (slides[i].getAttribute("data-id") !== currentId) {
      offset += slides[i].offsetWidth;
    } else {
      offset += slides[i].offsetWidth / 2;
      //console.log(offset)
      return offset;
    }
  }
}

export const Swiper = ({
  rowList = [{ id: 1 }],
  rowSelect,
  setRowSelect,
  colList = [{ id: 1 }],
  colSelect,
  setColSelect,
  slideContents,
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

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(getScrollOffset(colSelect));
  }, [colSelect]);

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
              onClick={() => {
                setRowSelect(row.id);
                setColSelect(col.id);
                // setCurrentSloganId(moveToId(slogans, id, currentSloganId))
              }}
            >
              {slideContents(row, col)}
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
  height: 100%;
  color: black;
  user-select: none;
  transition: transform 0.3s;
  transform: translateX(calc(50vw - ${(props) => props.offset}px));
`;

const Slide = styled.div`
  padding: 1em;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: background-color 0.3s 0.1s;
  background-color: ${({ active }) =>
    active ? "rgba(255,0,255,0.5)" : "transparent"};
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
