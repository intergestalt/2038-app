import React, { useRef } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

import Slide from "./Slide";

const config = {
  delta: 20, // min distance(px) before a swipe starts
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
  currentColor,
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
              currentColor={currentColor}
              active={
                slogan.id === currentSlogan && language.id === currentLanguage
              }
              activeColumn={
                language.id === currentLanguage
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
              {slogan.text[language.id]}
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
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  // background: linear-gradient(90deg, rgba(0,0,0,0.6) 33%, rgba(0,0,0,0.4) 33%, rgba(0,0,0,0.4) 66%, rgba(0,0,0,0.4) 66%);
`;

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: ${({ currentColumn }) => `calc( -${currentColumn} * var(--slide-width) + ( var(--slide-width) / 2) )`};
  will-change: left;
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
  transition: left 0.5s;
`;
