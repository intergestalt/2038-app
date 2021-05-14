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
  const index = list.findIndex((s) => s.id === id);
  if (index !== undefined) {
    if (index < list.length - 1) {
      return list[index + 1].id;
    } else {
      return id;
    }
  }
}

function prevId(list, id) {
  const index = list.findIndex((s) => s.id === id);
  if (index !== undefined) {
    if (index > 0) {
      return list[index - 1].id;
    } else {
      return id;
    }
  }
}

function moveToSlogan(slogans, targetId, currentId) {
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

export const SloganSelector = ({
  languages,
  currentLanguage,
  setCurrentLanguage,
  slogans,
  currentSloganId,
  setCurrentSloganId,
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
    } else if (dir === "Up") {
      setCurrentLanguage(prevId(languages, currentLanguage));
    } else if (dir === "Down") {
      setCurrentLanguage(nextId(languages, currentLanguage));
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
      {slogans.map(({ id: sId, text }) => (
        <Row key={sId}>
          {languages.map(({ id: lId }) => (
            <Slide
              className="slide"
              data-id={`${sId}-${lId}`}
              key={lId}
              active={currentSloganId === sId && currentLanguage === lId}
              onClick={() => {
                setCurrentLanguage(lId);
                setCurrentSloganId(sId);
              }}
            >
              {sId} {lId} : {text[lId]}
            </Slide>
          ))}
        </Row>
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
  padding: 1em;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  transition: background-color 0.3s 0.1s;
  background-color: ${({ active }) =>
    active ? "rgba(255,0,255,0.5)" : "transparent"};
`;

const Row = styled.div``;
