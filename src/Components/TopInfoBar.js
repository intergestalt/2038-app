import React from "react";
import styled from "styled-components";

import { InfoButton } from './InfoButton'

const TopInfoBar = () => {
  return (
    <Container>
      <InfoButton />
      <Text>
        2038.xyz
      </Text>
    </Container>
  );
};

export default TopInfoBar

const Container = styled.div`
  display: flex;
  font-family: 'Roboto Mono', monospace;
`;


const Text = styled.span`
  
`;
