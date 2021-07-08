import React, { useRef, Fragment } from "react";
import styled from "styled-components";
import "intersection-observer-debugger";
import { useSwipeable } from "react-swipeable";
import { useIntersect } from "../Hooks/useIntersect";

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
  slideWidth = 300,
  slideHeight = 200,
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
  const targetTop = (height - slideHeight) / 2;
  const targetLeft =
    width / 2 -
    (languages.findIndex((x) => x.id === currentLanguage) + 0.5) * slideWidth;
  const rootMargin = `-${(height - slideHeight) / 2 || 0}px -${
    (width - slideWidth) / 2 || 0
  }px`;
  console.log({ width, height, targetRef, root, rootMargin });
  function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCurrentSlogan(entry.target.id);
      }
    });
  }
  const [addIntersectNode, intersectNodes] = useIntersect(handleIntersect, {
    root,
    rootMargin,
    threshold: 0.8,
  });
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
      <Container left={targetLeft}>
        {/* <Spacer height={targetTop} /> */}
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
                console.log({ language: language.id, slogan: slogan.id });
                setCurrentLanguage(language.id);
              }}
              activate={() => {
                // setCurrentLanguage();
                setCurrentSlogan(slogan.id);
              }}
              addToIO={addIntersectNode}
            >
              <p>{slogan.text[language.id]}</p>
            </Slide>
          )),
        )}
        {/* <Spacer height={targetTop} /> */}
      </Container>
      {dev && (
        <Fragment>
          <Target
            top={targetTop}
            left={targetLeft}
            width={slideWidth}
            height={slideHeight}
          />
          <Info>
            w: {window.innerWidth}
            <br />
            h: {window.innerHeight}
            <br />
            width: {width}
            <br />
            height: {height}
            <div>
              Slogan:
              <button
                onClick={() => {
                  if (slogans.findIndex((x) => x.id === currentSlogan) > 0) {
                    setCurrentSlogan(
                      slogans[
                        slogans.findIndex((x) => x.id === currentSlogan) - 1
                      ].id,
                    );
                  }
                }}
              >
                -
              </button>
              {currentSlogan}
              <button
                onClick={() => {
                  if (
                    slogans.findIndex((x) => x.id === currentSlogan) <
                    slogans.length
                  ) {
                    setCurrentSlogan(
                      slogans[
                        slogans.findIndex((x) => x.id === currentSlogan) + 1
                      ].id,
                    );
                  }
                }}
              >
                +
              </button>
            </div>
            <div>
              Language:
              <button
                onClick={() => {
                  if (
                    languages.findIndex((x) => x.id === currentLanguage) > 0
                  ) {
                    setCurrentLanguage(
                      languages[
                        languages.findIndex((x) => x.id === currentLanguage) - 1
                      ].id,
                    );
                  }
                }}
              >
                -
              </button>
              {currentLanguage}
              <button
                onClick={() => {
                  if (
                    languages.findIndex((x) => x.id === currentLanguage) > 0
                  ) {
                    setCurrentLanguage(
                      languages[
                        languages.findIndex((x) => x.id === currentLanguage) + 1
                      ].id,
                    );
                  }
                }}
              >
                +
              </button>
            </div>
          </Info>
        </Fragment>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --slide-width: ${(slideWidth) => slideWidth}px;
  --slide-height: ${(slideHeight) => slideHeight}px;
  --cols: ${({ cols }) => cols};
  --rows: ${(rows) => rows};
  position: absolute;
  box-sizing: content-box-box;
  border: 8px red solid;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: ${({ left }) => `${left}px`};
  width: calc(var(--cols) * var(--slide-width));
  height: calc(var(--rows) * var(--slide-height));
  display: grid;
  grid-template-columns:
    calc((100% - var(--slide-width)) / 2) repeat(
      var(--cols),
      var(--slide-width)
    )
    calc((100% - var(--slide-width)) / 2);
  grid-template-rows:
    calc((100% - var(--slide-height)) / 2) repeat(
      var(--rows),
      var(--slide-height)
    )
    calc((100% - var(--slide-height)) / 2);
  grid-auto-columns: var(--slide-width);
  grid-auto-rows: var(--slide-height);
  overflow: scroll;
  padding-block: calc(50% - (var(--slide-height) / 2));
  scroll-padding: calc((100% - var(--slide-height)) / 2);
  scroll-snap-type: both mandatory;
  overflow-x: hidden;
`;

const Spacer = styled.div`
  box-sizing: border-box;
  height: ${({ height }) => `${height}px`};
`;

const Target = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  width: var(--slide-width);
  height: var(--slide-height);
  border: 2px purple dashed;
`;

const Info = styled.div`
  pointer-events: none;
  padding: 8px;
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: small;
`;
