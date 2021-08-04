import React from "react";
import styled from "styled-components";

import { Swiper } from "./Swiper";
import { CameraButton } from "./CameraButton";
import { SelectButton } from "./SelectButton";
import { InfoButton } from "./InfoButton";

import { breakpoints } from "../config";

function ControlPanel({
  currentLanguage,
  slogans,
  sloganSelect,
  toggleSloganSelect,
  currentSloganId,
  setCurrentSloganId,
  snap,
  colors,
  currentColor,
  setCurrentColor,
}) {
  console.log({
    currentLanguage,
    slogans,
    currentSloganId,
    setCurrentSloganId,
    currentColor,
  });
  return (
    <Container>
      <Top>
        <Swiper
          key={currentLanguage + "swiper"}
          currentLanguage={currentLanguage}
          slogans={slogans}
          currentSloganId={currentSloganId}
          setCurrentSloganId={setCurrentSloganId}
          currentColor={currentColor}
        />
      </Top>
      <Bottom>
        <Left>
          <IconsContainer
            onClick={() => {
              console.log(`sloganSelect clicked: ${sloganSelect}`);
              toggleSloganSelect();
            }}
          >
            {sloganSelect ? <CameraButton /> : <SelectButton />}
          </IconsContainer>
          <InfoButtonContainer>
            <InfoButton />
          </InfoButtonContainer>
        </Left>
        <Center>
          <SnapButton onClick={snap} color={currentColor} />
        </Center>
        <Right>
          {colors.map((c) => (
            <RoundButton
              key={c}
              color={c}
              selected={c === currentColor}
              onClick={() => {
                console.log(c);
                setCurrentColor(c);
              }}
            />
          ))}
        </Right>
      </Bottom>
    </Container>
  );
}

export default ControlPanel;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Top = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  font-size: 20px;
  mask-mode: luminance;
  mask-image: linear-gradient(
    90deg,
    transparent 20px,
    white 30%,
    white 70%,
    transparent calc(100% - 20px)
  );
`;

const Bottom = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 4vh;
  padding: 0 20px 15px;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const IconsContainer = styled.div`
  cursor: pointer;
`

const InfoButtonContainer = styled.span`
  margin-left: 20px;
  display: initial;
  @media ${breakpoints.medium} {
    display: none;
  }
`;

const SnapButton = styled.div`
  height: 42px;
  width: 42px;
  @media ${breakpoints.large} {
    height: 60px;
    width: 60px;
  }
  box-sizing: border-box;
  border-radius: 50%;
  background-color: transparent;
  border: solid 5px ${(props) => props.color || "black"};
  position: relative;
  cursor: pointer;
  &:before {
    /* white circle */
    content: "";
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: white;
  }

  &:hover {
    &:before {
    }
  }
`;

const RoundButton = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: ${(props) => (!props.selected ? "pointer" : "default")};
  margin: ${(props) => (props.selected ? "0" : "2px")};
  border: ${(props) => (props.selected ? "solid white 2px" : "none")};
  margin-left: 10px;
`;
