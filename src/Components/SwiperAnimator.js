import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Swiper } from "./Swiper";

export const SwiperAnimator = (props) => {

  let {
    currentLanguage,
  } = props

  let [mount, setMount] = useState(false)
  let [show, setShow] = useState(false)
  let [currentLanguageDelayed, setCurrentLanguageDelayed] = useState(currentLanguage)

  // delayed mount to fix scroll position issues
  useEffect(() => {
    setTimeout(() => setMount(true), 100)
    setTimeout(() => setShow(true),400)
  }, []);

  // fade out and in again when language changes
  useEffect(() => {
    setShow(false)
    setCurrentLanguageDelayed(currentLanguage)
    setTimeout(() => setShow(true), 600)
  }, [currentLanguage]);

  return (
    <Container show={show}>
      { mount && <Swiper {...props} currentLanguage={currentLanguageDelayed}/> }
    </Container>
  );
};

const Container = styled.div`
  opacity: ${({show}) => show ? "1" : "0"};
  transition: opacity 0.3s;
`;
