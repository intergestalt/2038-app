import React, { useState, useEffect, useRef, Fragment } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";
import useDimensions from "react-cool-dimensions";

import { Slide } from "./Slide";

const config = {
  delta: 15, // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false, // preventDefault on touchmove, *See Details*
  trackTouch: true, // track touch input
  trackMouse: false, // track mouse input
  rotationAngle: 0, // set a rotation angle
};

function getOffsetIndex(list, index, offset) {
  let offsetIndex = index + offset;
  let out =
    offsetIndex > list.length - 1
      ? offsetIndex - list.length
      : offsetIndex < 0
      ? offsetIndex + list.length
      : offsetIndex;
  console.log({ list, index, offset, out });
  return out;
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
  dev = false,
  rows = 3,
  cols = 5,
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
  wrapRow = true,
  wrapCol = true,
}) => {
  const ref = useRef();
  const { observe, unobserve, width, height, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
      // Triggered whenever the size of the target is changed...

      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });
  console.log({ width }, { height });
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
      setRowSelect(getOffsetIndex(rowList, rowSelect, 1));
    } else if (rowList.length > 1 && dir === "Down") {
      setRowSelect(getOffsetIndex(rowList, rowSelect, -1));
    } else if (colList.length > 1 && dir === "Right") {
      setColSelect(getOffsetIndex(colList, colSelect, -1));
    } else if (colList.length > 1 && dir === "Left") {
      setColSelect(getOffsetIndex(colList, colSelect, 1));
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData),
    ...config,
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const range = (start, end, increment) => {
    let arr = [];
    for (let i = start; i <= end; i += increment) {
      arr.push(i);
    }
    return arr;
  };

  const posX = range(-1, 1, 1);
  const posY = range(-2, 2, 1);

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

  const centrePos = {
    x: width / 2,
    y: height / 2,
  };

  dev && console.log(rowList[rowSelect].text[colList[colSelect].id]);

  const getContents = (x = 0, y = 0, wrap = true) => {
    return (
      (colList[getOffsetIndex(colList, colSelect, x)] &&
        rowList[getOffsetIndex(rowList, rowSelect, y)].text &&
        rowList[getOffsetIndex(rowList, rowSelect, y)].text[
          colList[getOffsetIndex(colList, colSelect, x)].id
        ]) ||
      "nada"
    );
  };

  return (
    <Container
      {...handlers}
      ref={(el) => {
        observe(el);
        handlers.ref(el);
        ref.current = el;
      }}
    >
      {dev && (
        <Fragment>
          <Info>
            w: {window.innerWidth}
            <br />
            h: {window.innerHeight}
            <br />
            x: {offset.x}
            <br />
            y: {offset.y}
            <br />
            width: {width}
            <br />
            height: {height}
            <div>
              Row:
              <button
                onClick={() =>
                  setRowSelect(getOffsetIndex(rowList, rowSelect, -1))
                }
              >
                -
              </button>
              {rowSelect}
              <button
                onClick={() =>
                  setRowSelect(getOffsetIndex(rowList, rowSelect, 1))
                }
              >
                +
              </button>
            </div>
            <div>
              Col:
              <button
                onClick={() =>
                  setColSelect(getOffsetIndex(colList, colSelect, -1))
                }
              >
                -
              </button>
              {colSelect}
              <button
                onClick={() =>
                  setColSelect(getOffsetIndex(colList, colSelect, 1))
                }
              >
                +
              </button>
            </div>
          </Info>
          <Dot x={centrePos.x} y={centrePos.y}>
            {`x: ${centrePos.x}, y: ${centrePos.y}`}
          </Dot>
        </Fragment>
      )}
      {posX.map((x) =>
        posY.map((y) => (
          <Slide
            key={`${getOffsetIndex(colList, colSelect, x)},${getOffsetIndex(
              rowList,
              rowSelect,
              y,
            )}`} // slogan id and lang id / rowIndex and colIndex
            width={slideWidth}
            height={slideHeight}
            x={centrePos.x + (x - 0.5) * slideWidth}
            y={centrePos.y + (y - 0.5) * slideHeight}
            active={x === 0 && y === 0}
            backgroundColor={
              x === 0 ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
            }
            onClick={() => {
              setColSelect(getOffsetIndex(colList, colSelect, x));
              setRowSelect(getOffsetIndex(rowList, rowSelect, y));
            }}
          >
            <Text
              textColor={x === 0 && y === 0 ? activeColor : "white"}
              dangerouslySetInnerHTML={{
                __html: slideContents(
                  colList[getOffsetIndex(colList, colSelect, x)],
                  rowList[getOffsetIndex(rowList, rowSelect, y)],
                ),
              }}
            ></Text>
          </Slide>
        )),
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  text-align: center;
  color: ${({ textColor }) => textColor};
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

const Dot = styled.div`
  position: absolute;
  text-align: center;
  vertical-align: middle;
  top: ${({ y }) => y - 5}px;
  left: ${({ x }) => x - 5}px;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: red;
`;
