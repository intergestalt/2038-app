import React from "react";
import styled from "styled-components/macro";

import FillViewport from "./FillViewport";
import ZFontOverlay from "./ZFontOverlay";
import ControlPanel from "./ControlPanel";
import { SloganSelector } from "./SloganSelector";
import TopInfoBar from "./TopInfoBar";
import { Flash } from "./Flash";
import { Tutorial } from "./Tutorial"
import { Question } from "./Question"

import config from "../config.json";
import { colors } from "../config.js";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.languages = config.languages;
    this.slogans = config.slogans;
    this.colors = config.colors;
    this.state = {
      currentLanguage: this.languages[0].id,
      currentSloganId: this.slogans[1].id,
      currentColor: this.colors[0],
      imageDataUrl: null,
      filename: null,
      sloganSelect: false,
      tutorialState: null,
      dev: process.env.NODE_ENV !== "production",
    };

    this.overlayRef = React.createRef();
    this.topRef = React.createRef();
  }

  snap = () => {
    const imageDataUrl = this.overlayRef.current.snap();
    console.log(imageDataUrl);
    this.setState({ 
      imageDataUrl,
      filename: this.makeFilename()
    });
  };

  initVideo = () => {
    this.overlayRef.current.initVideo()
  }

  initSensors = () => {
    this.overlayRef.current.initSensors()
  }

  toggleSloganSelect = () => {
    this.setState((state) => ({
      sloganSelect: !state.sloganSelect,
    }));
  };

  clearPicture = () => {
    this.setState({ imageDataUrl: null });
  };

  setCurrentColor = (c) => {
    this.setState({ currentColor: c });
  };

  setCurrentSlogan =  (id) => {
    this.setState({ currentSloganId: id })
  }

  setCurrentLanguage = (id) => {
    this.setState({ currentLanguage: id });
  }

  makeFilename = () => {
    return (
      this.slogans.find(({ id }) => id === this.state.currentSloganId).akronym +
      ".jpg"
    );
  };

  switchTutorialState = state => {
    console.log(state)
    if (this.state.tutorialState === "setupVideo") {
      this.initVideo()
      this.setState({ tutorialState: "setupSensors" })
    }
    if (this.state.tutorialState === "setupSensors") {
      this.initSensors()
      this.setState({ tutorialState: null })
    }
  }

  componentDidMount() {
    this.setState({ tutorialState: "setupVideo"})
  }

  render() {
    console.log(this.overlayRef);
    this.overlayRef.illo &&
      console.log({
        width: this.overlayRef.illo.width,
        height: this.overlayRef.illo.height,
      });
    const text =
      this.slogans.find((s) => s.id === this.state.currentSloganId).text[
        this.state.currentLanguage
      ] || "";

    return (
      <FillViewport>
        <Container>
          <Above>
            <TopInfoBar />
          </Above>
          <Top ref={this.topRef} color={this.state.currentColor}>
            <TopInner>
              <Flash trigger={!!this.state.imageDataUrl} color={this.state.currentColor}/>
              <ZFontOverlay
                dev={this.state.dev}
                text={text}
                ref={this.overlayRef}
                color={this.state.currentColor}
                snapped={!!this.state.imageDataUrl}
                blur={!!this.state.sloganSelect || !!this.state.tutorialState}
              />

              {this.state.tutorialState && (
                <Overlay>
                  <Tutorial stateName={this.state.tutorialState} onNext={this.switchTutorialState} />
                </Overlay>
              )}

              {this.state.sloganSelect && (
                <Overlay>
                  <SloganSelector
                    width={this.topRef.current.clientWidth}
                    height={this.topRef.current.clientHeight}
                    root={this.topRef.current}
                    dev={this.state.dev}
                    languages={this.languages}
                    currentLanguage={this.state.currentLanguage}
                    setCurrentLanguage={this.setCurrentLanguage}
                    slogans={this.slogans}
                    currentSlogan={this.state.currentSloganId}
                    setCurrentSlogan={this.setCurrentSlogan}
                    currentColor={this.state.currentColor}
                  />
                </Overlay>
              )}

              {!!this.state.imageDataUrl && (
                <Overlay>
                  <Question 
                    imageDataUrl={this.state.imageDataUrl} 
                    onCancel={this.clearPicture}
                    onSave={this.clearPicture}
                    filename={this.state.filename}
                  />
                </Overlay>
              )}
            </TopInner>
          </Top>
          <Bottom>
            <ControlPanel
              languages={this.languages}
              slogans={this.slogans}
              sloganSelect={this.state.sloganSelect}
              toggleSloganSelect={this.toggleSloganSelect}
              currentLanguage={this.state.currentLanguage}
              currentSloganId={this.state.currentSloganId}
              setCurrentSloganId={(id) =>
                this.setState({ currentSloganId: id })
              }
              snap={this.snap}
              colors={this.colors}
              currentColor={this.state.currentColor}
              setCurrentColor={this.setCurrentColor}
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
  font-family: "Haas", sans-serif;
`;

const Above = styled.div`
  background: ${colors.bg};
`;

const Top = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  background-color: ${({color}) => color}
`;

const TopInner = styled.div`
  max-width: 120vh;
  width: 100%;
  height: 100%;
`

const Bottom = styled.div`
  background: ${colors.bg};
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
`;

const Overlay = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(127, 127, 127, 0.9);
  z-index: 10;
`;
