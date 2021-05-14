import React from "react";
import styled from "styled-components";

import { Swiper } from "./Swiper";
import { CameraButton } from "./CameraButton";
import { SelectButton } from "./SelectButton";

function ControlPanel({
  languages,
  slogans,
  sloganSelect,
  toggleSloganSelect,
  currentLanguage,
  currentSloganId,
  setCurrentSloganId,
  snap,
  colors,
  currentColor,
  setCurrentColor,
}) {
  return (
    <Container>
      <Top>
        <Swiper
          colList={slogans}
          colSelect={currentSloganId}
          setColSelect={setCurrentSloganId}
          rowList={[{ id: currentLanguage }]}
          rowSelect={currentLanguage}
          setRowSelect={() => {}}
          slideContents={(row, col) => col.akronym[row.id]}
        />
      </Top>
      <Bottom>
        <Left>
          <div
            onClick={() => {
              console.log(`sloganSelect clicked: ${sloganSelect}`);
              toggleSloganSelect();
            }}
          >
            {sloganSelect ? <CameraButton /> : <SelectButton />}
          </div>
        </Left>
        <Center>
          <SnapButton onClick={snap} color="red" />
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
  color: black;
`;

const Top = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Bottom = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  background: lightgrey;
  font-size: 4vh;
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

const SnapButton = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: solid 5px ${(props) => props.color || "black"};
  position: relative;
  cursor: pointer;
  &:before {
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
`;
