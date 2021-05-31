import React, { useState, useEffect, useRef } from "react";
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

  const range = (start, end, increment) => {
    let arr = [];
    for (let i = start; i <= end; i += increment) {
      arr.push(i);
    }
    return arr;
  };

  const posX = range(-1, 1, 1);
  const posY = range(-2, 2, 1);

  const calcPos = (x, y, len, wrap) => {
    return x - y < 0 ? x - y + len : x - y > len ? x - y - len : x - y;
  };

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

  console.log(rowList[rowSelect].text[colList[colSelect].id]);

  const getContents = (x = 0, y = 0, wrap = true) => {
    return (
      (colList[colSelect + y] &&
        rowList[rowSelect + x].text[colList[colSelect + y].id]) ||
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
          {colSelect}
          <button onClick={() => setColSelect(++colSelect)}>+</button>
          <button onClick={() => setColSelect(--colSelect)}>-</button>
        </div>
      </Info>
      <Dot x={centrePos.x} y={centrePos.y}>
        {`x: ${centrePos.x}, y: ${centrePos.y}`}
      </Dot>
      {posX.map((x) =>
        posY.map((y) => (
          <Slide
            key={`${x} ${y}`} // slogan id and lang id / rowIndex and colIndex
            width={slideWidth}
            height={slideHeight}
            x={centrePos.x + (x - 0.5) * slideWidth}
            y={centrePos.y + (y - 0.5) * slideHeight}
            active={x === 0 && y === 0}
            backgroundColor={
              x === 0 ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
            }
            onClick={() => {
              alert(`clicked ${x}, ${y}`);
              setColSelect(colSelect + x);
              setRowSelect(rowSelect + y);
            }}
          >
            <Text
              textColor={x === 0 && y === 0 ? activeColor : "white"}
              dangerouslySetInnerHTML={{
                __html: getContents(x, y).replace(/\n/gi, "<br />"),
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
  left: 2px;
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
