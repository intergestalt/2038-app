import React, { useState } from "react";
import styled from "styled-components/macro";

import FillViewport from "./FillViewport";
import ZFontOverlay from "./ZFontOverlay";
import ControlPanel from "./ControlPanel";

import config from "./config.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.slogans = config.slogans;
    this.colors = config.colors;
    this.state = {
      currentSloganId: this.slogans[1].id,
      currentColor: this.colors[0],
      imageDataUrl: null,
      sloganSelect: false,
    };

    this.overlayRef = React.createRef();
  }

  snap = () => {
    const imageDataUrl = this.overlayRef.current.snap();
    console.log(imageDataUrl);
    this.setState({ imageDataUrl });
  };

  toggleSloganSelect = () => {
    console.log("toggleSloganSelect executed");
    this.setState((state) => ({ sloganSelect: !state.sloganSelect }));
  };

  clearPicture = () => {
    this.setState({ imageDataUrl: null });
  };

  setCurrentColor = (c) => {
    this.setState({ currentColor: c });
  };

  makeFilename = () => {
    return (
      this.slogans.find(({ id }) => id === this.state.currentSloganId).akronym +
      ".jpg"
    );
  };

  render() {
    const language = "en";
    const text = this.slogans.find((s) => s.id === this.state.currentSloganId)
      .text[language];

    return (
      <FillViewport>
        <Container>
          <Top>
            <ZFontOverlay
              text={text}
              ref={this.overlayRef}
              color={this.state.currentColor}
              snapped={!!this.state.imageDataUrl}
              slogans={this.slogans}
              sloganSelect={this.state.sloganSelect}
              currentSloganId={this.state.currentSloganId}
              setCurrentSloganId={(id) =>
                this.setState({ currentSloganId: id })
              }
            />
            {this.state.imageDataUrl && (
              <Overlay>
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
              </Overlay>
            )}
          </Top>
          <Bottom>
            <ControlPanel
              slogans={this.slogans}
              sloganSelect={this.state.sloganSelect}
              toggleSloganSelect={this.toggleSloganSelect}
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

const Top = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Bottom = styled.div`
  background: white;
  height: 100px;
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
`;

const Question = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: darkgrey;
  opacity: 0.93;
`;
