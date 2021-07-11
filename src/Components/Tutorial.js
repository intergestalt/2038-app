import React from "react";
import styled from "styled-components";
import { InfoButton } from "./InfoButton"

const states = [
  {
    name: "setupVideo",
    top: null,
    main: "Please allow access to the camera",
    next: true
  },
  {
    name: "setupSensors",
    top: null,
    main: "Please allow access to orientation sensors",
    next: true
  },
  {
    name: "intro1",
    top: "How to use this app",
    main: "Welcome to 2038\n\nPlease select a sentence below or open the overview",
    next: true
  }
]

export const Tutorial = ({stateName, onNext}) => {

  if (!stateName) return null

  const state = states.find(s => s.name === stateName)
  console.log(state, stateName, states)
  return (
    <Container>
      <Top visible={!!state.top}>
        <IconPosition>
          <InfoButton type="close" />
        </IconPosition>
        <TopText>
          {state.top}
        </TopText>
      </Top>
      <Main>
        <MainText>
          {state.main}
        </MainText>
      </Main>
      <Bottom>
        <BottomText onClick={() => onNext(state)} >
          {state.next && "Next"}
        </BottomText>
      </Bottom>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: white;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  padding: 10px 20px;
  ${ ({visible}) => visible || "visibility: hidden; "}
`;

const Main = styled.div`
  flex: 1;
  font-family: "Haas", sans-serif;
  font-weight: bold;
  white-space: pre-line;
  color: white;
  font-size: 30px;
  line-height: 34px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainText = styled.div`
  text-align: center;
`

const IconPosition = styled.span`
  position: absolute;
  left: 20px;
`;

const TopText = styled.span`
  width: 100%;
  display: block;
  text-align: center;
`;

const Bottom = styled.div`
  height: 40px;
  font-weight: normal;
  text-align: center;
`

const BottomText = styled.span`
  cursor: pointer;
`