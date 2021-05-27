import React, { Fragment } from "react";
import styled from "styled-components/macro";

import FillViewport from "./FillViewport";
import ZFontOverlay from "./ZFontOverlay";
import ControlPanel from "./ControlPanel";
import { SloganSelector } from "./SloganSelector";

import config from "../config.json";

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
    const text = this.slogans.find((s) => s.id === this.state.currentSloganId)
      .text[this.state.currentLanguage];

    return (
      <FillViewport>
        <Container>
          <Top>
            <ZFontOverlay
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
                    colList={this.languages}
                    colSelect={this.languages.findIndex(
                      (x) => x.id === this.state.currentLanguage,
                    )}
                    setColSelect={(index) =>
                      this.setState({
                        currentLanguage: this.languages[index].id,
                      })
                    }
                    rowList={this.slogans}
                    rowSelect={this.slogans.findIndex(
                      (x) => x.id === this.state.currentSloganId,
                    )}
                    setRowSelect={(index) =>
                      this.setState({ currentSloganId: this.slogans[index].id })
                    }
                    activeColor={this.state.currentColor}
                    slideContents={(row, col) =>
                      row.text[col.id].replace(/\n/g, `<br />`)
                    }
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
  background-color: rgba(127, 127, 127, 0.9);
`;

const Question = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: darkgrey;
  opacity: 0.93;
`;
