import React from "react";
import styled from "styled-components";

export const CameraButton = () => {
  return (
    <Svg
      height="100%"
      viewBox="0 0 35 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0 1)">
        <Path d="M0,0L15,0" />
      </g>
      <g transform="translate(20 1)">
        <Path d="M0,0L15,0" />
      </g>
      <g transform="translate(0 10)">
        <Path d="M0,0L15,0" />
      </g>
      <g transform="translate(20 10)">
        <Path d="M0,0L15,0" />
      </g>
      <g transform="translate(0 19)">
        <Path d="M0,0L15,0" />
      </g>
      <g transform="translate(20 19)">
        <Path d="M0,0L15,0" />
      </g>
    </Svg>
  );
};

const Path = styled.path`
  fill: none;
  fill-rule: nonzero;
  stroke: red;
  stroke-width: 2px;
`;

const Svg = styled.svg`
  fill-rule: evenodd;
  clip-rule: evenodd;
  height: 20px;
  width: 35px;
`;
