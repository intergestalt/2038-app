import React from 'react';
import styled from 'styled-components'

import Swiper from './Swiper'


function ControlPanel({language, slogans, currentSloganId, setCurrentSloganId, snap }) {
  return (
    <Container>
      <Top>
        <Swiper slogans={slogans} currentSloganId={currentSloganId} setCurrentSloganId={setCurrentSloganId} />
      </Top>
      <Bottom>
        <Left>≡≡</Left>
        <Center>
          <button onClick={snap}>
            ◉
          </button>
        </Center>
        <Right>◎◎◎</Right>
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
`

const Top = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const Bottom = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  background: yellow;
  font-size:4vh;
`

const Left = styled.div`
  
`

const Center = styled.div`
  
`

const Right = styled.div`
  
`

const Slide = styled.div`
  height: 100%;
  width: 30%;
  background: rgba(255,0,255,0.5);
`