import React from "react";
import styled from "styled-components";

export default class FillViewport extends React.Component {
  constructor() {
    super();

    this.state = {
      vh: 0,
      vw: 0,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    this.setState({ vh, vw });
  }

  render() {
    return (
      <Container vh={this.state.vh} vw={this.state.vw}>
        {this.props.children}
      </Container>
    );
  }
}

const Container = styled.div`
  position: fixed;
  width: ${({ vw }) => vw}px;
  height: ${({ vh }) => vh}px;
`;
