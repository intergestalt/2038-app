import React, { useRef, Fragment } from "react";
import styled from "styled-components";
// import { useInView } from "react-intersection-observer";
// import useDimensions from "react-cool-dimensions";
import { useIntersect } from "../Hooks/useIntersect";

import Slide from "./Slide";

// let rootMargin = "0px"; //"-300px 0px -150px 0px";
// let targetTop = 0;
// let targetLeft = 0;

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
  console.log({ currentLanguage });
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
      console.log("here");
      if (entry.isIntersecting) {
        console.log({ entry });
        console.log(`setting current slogan to ${entry.id}`);
        setCurrentSlogan(slogans.findIndex((x) => x.id === entry.target.id));
      }
    });
  }
  const [addIntersectNode, intersectNodes] = useIntersect(handleIntersect, {
    root,
    rootMargin,
    threshold: 0.5,
  });
  console.log({ intersectNodes });

  return (
    <Wrapper width={width} height={height} ref={targetRef}>
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
  position: absolute;
  box-sizing: border-box;
  border: 8px red solid;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: ${({ left }) => `${left}px`};
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns:
    calc((100% - var(--slide-width)) / 2) repeat(4, var(--slide-width))
    calc((100% - var(--slide-width)) / 2);
  grid-template-rows:
    calc((100% - var(--slide-height)) / 2) repeat(4, var(--slide-height))
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
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  border: 2px purple dashed;
`;

const Info = styled.div`
  padding: 8px;
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: small;
`;
