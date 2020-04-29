import React, { useState } from 'react';
import styled from 'styled-components'

import FillViewport from './FillViewport'
import ZFontOverlay from './ZFontOverlay'
import ControlPanel from './ControlPanel'

import config from './config.json'

function App() {
  const slogans = config.slogans

  const [currentSloganId, setCurrentSloganId] = useState(slogans[1].id)

  const language = "cn"
  const text = slogans.find( s => s.id === currentSloganId ).text[language]

  console.log(text)

  return (
    <FillViewport>
        <Container>
        <Top>
          <ZFontOverlay text={text}/>
        </Top>
        <Bottom>
          <ControlPanel slogans={slogans} currentSloganId={currentSloganId} setCurrentSloganId={setCurrentSloganId} />
        </Bottom>
      </Container>
    </FillViewport>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Top = styled.div`
  flex: 1;
  overflow: hidden;
`

const Bottom = styled.div`
background: white;
  height: 100px;
`