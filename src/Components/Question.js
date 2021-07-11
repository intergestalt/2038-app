import React from "react";
import styled from "styled-components";

export const Question = ({imageDataUrl, onCancel, onSave, filename}) => {
  return (
    <Container>
      Keep this picture? <br />
      <br />
      <Img src={imageDataUrl} />
      <br />
      <QuestionChoice>
        <span
          style={{ textDecoration: "underline" }}
          onClick={onCancel}
        >
          Cancel
        </span>
        &nbsp;&nbsp;&nbsp;
        <a
          href={imageDataUrl}
          onClick={onSave}
          download={filename}
        >
          Save
        </a>
      </QuestionChoice>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: darkgrey;
  opacity: 0.93;
`;

const QuestionChoice = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 50vmin;
  height: auto;
  display: block;
`