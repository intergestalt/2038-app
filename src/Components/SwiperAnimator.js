import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Swiper } from "./Swiper";
import useOrientationChange from "use-orientation-change";

export const SwiperAnimator = (props) => {

  let {
    currentLanguage,
  } = props

  let [mount, setMount] = useState(false)
  let [show, setShow] = useState(false)
  let [currentLanguageDelayed, setCurrentLanguageDelayed] = useState(currentLanguage)

  const orientation = useOrientationChange()

  // delayed mount to fix scroll position issues
  useEffect(() => {
    setTimeout(() => setMount(true), 100)
    setTimeout(() => setShow(true),400)
  }, []);
  

  // handle oriantation change with remount
  
  
  useEffect(()=> {
    if (mount) {
      setMount(false)
      setTimeout(() => setMount(true), 100)
    }
  }, [orientation])
  


  // fade out and in again when language changes
  useEffect(() => {
    setShow(false)
    setTimeout(() => setCurrentLanguageDelayed(currentLanguage), 300)
    setTimeout(() => setShow(true), 600)
  }, [currentLanguage]);

  return (
    <Container show={show}>
      {mount && <Swiper {...props} currentLanguage={currentLanguageDelayed} key={currentLanguageDelayed + "swiper"}/> }
    </Container>
  );
};

const Container = styled.div`
  opacity: ${({show}) => show ? "1" : "0"};
  transition: opacity 0.3s;
  width: 100%;
  height: 100%;
  height: auto;
`;
