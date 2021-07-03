import React from "react";
import styled from "styled-components";

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
`;

const InfoButton = styled.span`
  
`;

const Text = styled.span`
  
`;
