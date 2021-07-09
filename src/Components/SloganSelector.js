import React, { useRef, Fragment } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

import Slide from "./Slide";

const config = {
  delta: 15, // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false, // preventDefault on touchmove, *See Details*
  trackTouch: true, // track touch input
  trackMouse: false, // track mouse input
  rotationAngle: 0, // set a rotation angle
};

export const SloganSelector = ({
  width,
  height,
  slideWidth = "50vw",
  slideHeight = "30vw",
  root,
  dev,
  languages,
  currentLanguage,
  setCurrentLanguage,
  slogans,
  currentSlogan,
  setCurrentSlogan,
}) => {
  dev = false;
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
    if (
      languages.findIndex((x) => x.id === currentLanguage) > 0 &&
      dir === "Right"
    ) {
      setCurrentLanguage(
        languages[languages.findIndex((x) => x.id === currentLanguage) - 1].id,
      );
    } else if (
      languages.findIndex((x) => x.id === currentLanguage) <
        languages.length - 1 &&
      dir === "Left"
    ) {
      setCurrentLanguage(
        languages[languages.findIndex((x) => x.id === currentLanguage) + 1].id,
      );
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData),
    ...config,
  });
  const targetRef = useRef();
  // const root = targetRef.current;
  const currentColumn = languages.findIndex( x => x.id === currentLanguage )
  function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCurrentSlogan(entry.target.id);
      }
    });
  }

  return (
    <Wrapper
      {...handlers}
      width={width}
      height={height}
      ref={(el) => {
        handlers.ref(el);
        targetRef.current = el;
      }}
      cols={languages.length}
      rows={slogans.length}
      slideWidth={slideWidth}
      slideHeight={slideHeight}
    >
      <Container currentColumn={currentColumn}>
        {languages.map((language, languageIndex) =>
          slogans.map((slogan, sloganIndex) => (
            <Slide
              id={slogan.id}
              key={`${sloganIndex},${languageIndex}`}
              row={sloganIndex + 1}
              column={languageIndex + 1}
              width={slideWidth}
              height={slideHeight}
              active={
                slogan.id === currentSlogan && language.id === currentLanguage
              }
              backgroundColor={
                language.id === currentLanguage ? "pink" : "black"
              }
              onClick={() => {
                console.log({ language: language.id, currentLanguageId: currentLanguage, slogan: slogan.id });
                if (currentLanguage === language.id) {
                  setCurrentSlogan(slogan.id);
                } else {
                  setCurrentLanguage(language.id);
                }
              }}
              activate={() => {
                // setCurrentLanguage();
                setCurrentSlogan(slogan.id);
              }}
            >
              <p>{slogan.text[language.id]}</p>
            </Slide>
          )),
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --slide-width: ${({ slideWidth }) => slideWidth};
  --slide-height: ${({ slideHeight }) => slideHeight};
  --cols: ${({ cols }) => cols};
  --rows: ${({ rows }) => rows};
  position: absolute;
  box-sizing: border-box;
  border: 8px red solid;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: ${({ currentColumn }) => `calc( -${currentColumn} * var(--slide-width) + ( var(--slide-width) / 2) )`};
  display: grid;
  grid-template-columns: repeat(var(--cols), var(--slide-width));
  grid-template-rows: repeat(var(--rows), var(--slide-height));
  grid-auto-columns: var(--slide-width);
  grid-auto-rows: var(--slide-height);
  /* overflow: scroll; */
  /*padding-block: calc((var(--wrapper-height) - var(--slide-height)) / 2);
  scroll-padding: calc((var(--wrapper-height) - var(--slide-height)) / 2);*/
  scroll-snap-type: both mandatory;
  overflow: hidden;
  transition: left 0.3s;
`;
