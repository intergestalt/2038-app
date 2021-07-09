import React from "react";
import styled from "styled-components/macro";

import FillViewport from "./FillViewport";
import ZFontOverlay from "./ZFontOverlay";
import ControlPanel from "./ControlPanel";
import { SloganSelector } from "./SloganSelector";
import TopInfoBar from "./TopInfoBar";
import { Mask2038 } from "./Mask2038";

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
      sloganSelect: false,
      overlay: null,
      dev: process.env.NODE_ENV !== "production",
    };

    this.overlayRef = React.createRef();
    this.topRef = React.createRef();
  }

  snap = () => {
    const imageDataUrl = this.overlayRef.current.snap();
    console.log(imageDataUrl);
    this.setState({ imageDataUrl });
  };

  toggleSloganSelect = () => {
    console.log("toggleSloganSelect executed");
    this.setState((state) => ({
      sloganSelect: !state.sloganSelect,
      overlay: !state.sloganSelect ? "sloganSelect" : null,
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
          <Top ref={this.topRef}>
            <Mask2038 show={!this.state.sloganSelect} />
            <ZFontOverlay
              dev={this.state.dev}
              text={text}
              ref={this.overlayRef}
              color={this.state.currentColor}
              snapped={!!this.state.imageDataUrl}
              blur={!!this.state.overlay}
            />
            {this.state.overlay && (
              <Overlay>
                {this.state.imageDataUrl && (
                  <Question>
                    Keep Picture? <br />
                    <br />
                    <span
                      style={{ textDecoration: "underline" }}
                      onClick={this.clearPicture}
                    >
                      discard
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <a
                      href={this.state.imageDataUrl}
                      onClick={this.clearPicture}
                      download={this.makeFilename()}
                    >
                      save
                    </a>
                  </Question>
                )}
                {this.state.overlay === "sloganSelect" && (
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
                )}
              </Overlay>
            )}
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
`;

const Above = styled.div`
  background: ${colors.bg};
`;

const Top = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Bottom = styled.div`
  background: ${colors.bg};
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
`;

const Question = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: darkgrey;
  opacity: 0.93;
`;
