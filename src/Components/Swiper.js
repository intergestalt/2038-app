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

function nextId(slogans, id) {
  const index = slogans.findIndex((s) => s.id === id);
  if (index !== undefined) {
    if (index < slogans.length - 1) {
      return slogans[index + 1].id;
    } else {
      return id;
    }
  }
}

function prevId(slogans, id) {
  const index = slogans.findIndex((s) => s.id === id);
  if (index !== undefined) {
    if (index > 0) {
      return slogans[index - 1].id;
    } else {
      return id;
    }
  }
}

function moveToId(slogans, targetId, currentId) {
  const targetIndex = slogans.findIndex((s) => s.id === targetId);
  const currentIndex = slogans.findIndex((s) => s.id === currentId);
  if (targetIndex > currentIndex) {
    return nextId(slogans, currentId);
  }
  if (targetIndex < currentIndex) {
    return prevId(slogans, currentId);
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
  language,
  slogans,
  currentSloganId,
  setCurrentSloganId,
  currentColor
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
    if (dir === "Left") {
      setCurrentSloganId(nextId(slogans, currentSloganId));
    } else if (dir === "Right") {
      setCurrentSloganId(prevId(slogans, currentSloganId));
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData),
    ...config,
  });

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(getScrollOffset(currentSloganId));
  }, [currentSloganId]);

  return (
    <Container {...handlers} offset={offset}>
      {slogans.map(({ akronym, id }) => (
        <Slide
          className="slide"
          data-id={id}
          key={id}
          active={currentSloganId === id}
          activeColor={currentColor}
          onClick={() =>
            setCurrentSloganId(moveToId(slogans, id, currentSloganId))
          }
        >
          {akronym}
        </Slide>
      ))}
    </Container>
  );
};

const Container = styled.div`
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
  padding: 15px 15px 12px;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: background-color 0.3s 0.1s;
  color: ${({ active, activeColor }) =>
    active ? activeColor : "currentColor"};
`;
