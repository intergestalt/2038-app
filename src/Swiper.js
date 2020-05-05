import React from 'react';
import styled from 'styled-components'

import { Swipeable } from 'react-swipeable'

const config = {
  delta: 10,                             // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
  trackTouch: true,                      // track touch input
  trackMouse: true,                      // track mouse input
  rotationAngle: 0,                      // set a rotation angle
}

function nextId(slogans, id) {
  const index = slogans.findIndex( s => s.id === id )
  if (index !== undefined) {
    if (index < slogans.length-1) {
      return slogans[index+1].id
    } else {
      return id
    }
  }
}

function prevId(slogans, id) {
  const index = slogans.findIndex( s => s.id === id )
  if (index !== undefined) {
    if (index > 0) {
      return slogans[index-1].id
    } else {
      return id
    }
  }
}

function moveToId(slogans, targetId, currentId) {
  const targetIndex = slogans.findIndex( s => s.id === targetId )
  const currentIndex = slogans.findIndex( s => s.id === currentId )
  if (targetIndex > currentIndex) {
    return nextId(slogans, currentId)
  }
  if (targetIndex < currentIndex) {
    return prevId(slogans, currentId)
  }
  return currentId
}

function Swiper({language, slogans, currentSloganId, setCurrentSloganId}) {
 
  const handleSwipe = ({
    event,          // source event
    initial,        // initial swipe [x,y]
    first,          // true for first event
    deltaX,         // x offset (initial.x - current.x)
    deltaY,         // y offset (initial.y - current.y)
    absX,           // absolute deltaX
    absY,           // absolute deltaY
    velocity,       // √(absX^2 + absY^2) / time
    dir,            // direction of swipe (Left|Right|Up|Down)
  }) => {
    console.log(dir)
    if (dir === "Right") {
      setCurrentSloganId(nextId(slogans, currentSloganId))
    } else {
      setCurrentSloganId(prevId(slogans, currentSloganId))
    }
  }
 
  return (
      <Container  onSwiped={(eventData) => handleSwipe(eventData)} {...config} >
        { slogans.map( ({akronym,id}) => 
          <Slide key={id} active={ currentSloganId==id } onClick={ () => setCurrentSloganId(moveToId(slogans, id, currentSloganId)) } >
            {akronym}
          </Slide> 
        )}
      </Container>
  );
}

export default Swiper;

const Container = styled(Swipeable)`
  display: inline-flex;
  flex-direction: row;
  height: 100%;
  color: black;
  user-select: none;
`

const Slide = styled.div`
  height: 100%;
  background: ${ ({active}) => active ? "rgba(255,0,255,0.5)" : "transparent" };
`