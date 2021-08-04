const colors = {
  bg: "#BEBEBE",
}

const dimensions = {
  maxVideoHeight: "120vw",
  breakpoints: {
    medium: {
      minHeightPx: 600,
    },
    large: {
      minHeightPx: 625,
    },
  }, 
}

const breakpoints = {
  'medium': `(min-height: ${dimensions.breakpoints.medium.minHeightPx}px)`,
  'large': `(min-height: ${dimensions.breakpoints.large.minHeightPx}px)`,
}

export { colors, breakpoints, dimensions };