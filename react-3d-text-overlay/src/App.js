import React, { useState } from 'react';
import styled from 'styled-components'

import FillViewport from './FillViewport'
import ZFontOverlay from './ZFontOverlay'
import ControlPanel from './ControlPanel'

import config from './config.json'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.slogans = config.slogans
    this.state = {
      currentSloganId: this.slogans[1].id
    }

    this.overlayRef = React.createRef();
  }

  render() {
    const language = "en"
    const text = this.slogans.find( s => s.id === this.state.currentSloganId ).text[language]
    
    return(
    <FillViewport>
        <Container>
        <Top>
          <ZFontOverlay text={text} ref={this.overlayRef} color={'#faf'}/>
        </Top>
        <Bottom>
          <ControlPanel 
            slogans={this.slogans} 
            currentSloganId={this.state.currentSloganId} 
            setCurrentSloganId={(id)=>this.setState({currentSloganId: id})} 
            snap={()=>{this.overlayRef.current.snap()}}
          />
        </Bottom>
      </Container>
    </FillViewport>
  );
  } 
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