import React from "react";
import styled from "styled-components";

export const CameraButton = () => {
  return (
    <Svg
      height="100%"
      viewBox="0 0 35 22"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="7" y="1" width="2" height="1" />
      <Rect x="1" y="3" width="33" height="18" />
      <Circle cx="17.5" cy="12" r="2" />
    </Svg>
  );
};

const Path = styled.path`
  fill: none;
  fill-rule:nonzero
  stroke: white;
  stroke-width: 2px;
`;

const Rect = styled.rect`
  fill: none;
  fill-rule:nonzero
  stroke: white;
  stroke-width: 2px;
`;

const Circle = styled.circle`
  fill: none;
  fill-rule:nonzero
  stroke: white;
  fill: white;
  stroke-width: 0;
`;

const Svg = styled.svg`
  fill-rule: evenodd;
  clip-rule: evenodd;
  height: 22px;
  width: 35px;
  stroke: white;
`;
