import React from "react";
import styled from "styled-components";

import { InfoButton } from './InfoButton'

import { breakpoints } from '../config'

const TopInfoBar = () => {
  return (
    <Container>
      <InfoButton />
      <Text href="https://2038.xyz" title="2038.xyz" target="_blank">
        2038.xyz
      </Text>
    </Container>
  );
};

export default TopInfoBar

const Container = styled.div`
  @media ${breakpoints.medium} {
    display: flex;
  }
  justify-content: space-between;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  color: white;
  padding: 10px 20px;
  display: none;
`;


const Text = styled.a`
  text-decoration: none;
  color: inherit;
`;
