import React from "react";
import styled from "styled-components";

import { cover } from "intrinsic-scale";
import { mask2038DataUrl } from './Mask2038.js'

import "@hughsk/fulltilt/dist/fulltilt";

const drawMaskCanvas = (canvas) => {
  // draw "2038" on a canvas
  if (!canvas) canvas = document.getElementById("2038-canvas")
  if (!canvas) return null
  const context = canvas.getContext('2d')
  // the dimensions of the element as shown in the browser
  const offsetWidth = canvas.offsetWidth
  const offsetHeight = canvas.offsetHeight
  // the dimensions of the canvas itself as defined at canvas creation
  const w = context.canvas.width
  const h = context.canvas.height
  // load image
  const image = new Image();
  image.src = mask2038DataUrl;
  //console.log("canvas size", w, h, offsetWidth, offsetHeight)
  image.onload = function () {
    //console.log("loaded image", image)
    const image_ar = image.height / image.width
    context.clearRect(0,0,w, h)
    context.drawImage(image, w * 0.35, 0, w * 0.3, w * 0.3 * image_ar * offsetWidth / offsetHeight * h / w);
  }
  return canvas
}

export default class ZFontOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //snapped: false, <- prop
      acceleration: { x: 0, y: 0, z: 0 },
      rotate: { x: 0, y: 0, z: 0 },
      rotateY: 0,
      orientation: { alpha: 0, beta: 0, gamma: 0 },
      width: null,
      height: null,
    };

    this.dragging = false;
    this.initSensors = this.initSensors.bind(this);
    //this.onDeviceOrientationChangeEvent = this.onDeviceOrientationChangeEvent.bind(this)
  }

  componentDidMount() {
    window.fov = -500;
    import("zdog").then((foo) => {
      window.Zdog = foo.default;
      import("zfont").then((foo) => {
        window.Zfont = foo.default;
        this.initZfont();
      });
    });

  }

  componentDidUpdate(prevProps) {
    if (this.props.blur !== prevProps.blur) {
      this.controlVideo();
    }
    if (this.props.text !== prevProps.text) {
      console.log("text changed to", this.props.text);
      this.text.value = this.props.text;
    }

    if (this.props.color !== prevProps.color) {
      console.log("color changed to", this.props.color);
      this.text.color = this.props.color;
    }

    //drawMaskCanvas(document.getElementById("2038-canvas"));
  }

  initSensors() {
    // iOS 13+

    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener(
              "deviceorientation",
              this.onDeviceOrientationChangeEvent,
              false,
            );
          }
        })
        .catch(function (error) {
          alert("sensor error");
          console.error("Unable to use DeviceOrientation API:", error);
        });
    } else {
      window.addEventListener(
        "deviceorientation",
        this.onDeviceOrientationChangeEvent,
        false,
      );
    }

    this.orientationData = new window.FULLTILT.DeviceOrientation({
      type: "world",
    });

    this.orientationData.start(this.onOrientationData);
  }

  onOrientationData = () => {
    // DeviceOrientation updated

    let angles = this.orientationData.getFixedFrameEuler();
    angles.rotateX(-Math.PI / 2);

    if (this.dragging) return;

    /*
    // seb
    this.illo.rotate.y = angles.alpha / 360 * 2 * Math.PI;
    this.illo.rotate.x = angles.beta / 360 * 2 * Math.PI;
    this.illo.rotate.z = 0; //angles.gamma / 360 * 2 * Math.PI;
  */
    // real
    this.illo.rotate.y =
      (angles.alpha / 360) * 2 * Math.PI + this.state.rotateY;
    this.illo.rotate.x = (angles.beta / 360) * 2 * Math.PI;
    this.illo.rotate.z = 0; //-angles.gamma / 360 * 2 * Math.PI;

    //this.setState({ rotate: {x:0, y:0, z:0 } })

    /*
    // cool
    this.illo.rotate.y = -(angles.alpha+180) / 360 * 2 * Math.PI;
    this.illo.rotate.x = angles.beta / 360 * 2 * Math.PI;
    this.illo.rotate.z = -0.5 * angles.gamma / 360 * 2 * Math.PI;
  */
  };

  initZfont = () => {
    let Zdog = window.Zdog;
    let Zfont = window.Zfont;

    // Init Zfont plugin and bind to Zdog
    Zfont.init(Zdog);

    // Create Zdog Illustration
    // https://zzz.dog/api#illustration
    this.illo = new Zdog.Illustration({
      element: "#zdog-canvas",
      dragRotate: true,
      rotate: { x: 0, y: 0, z: 0 },
      onDragStart: () => {
        this.dragging = true;
        this.rotateY0 = this.illo.rotate.y;
        this.rotateX0 = this.illo.rotate.x;
        this.rotateZ0 = this.illo.rotate.z;
      },
      onDragMove: () => {
        this.illo.rotate.x = this.rotateX0;
        this.illo.rotate.z = this.rotateZ0;
      },
      onDragEnd: () => {
        this.setState({ rotate: this.illo.rotate });
        this.setState({
          rotateY: this.state.rotateY + this.illo.rotate.y - this.rotateY0,
        });
        //alert(this.illo.rotate.y)
        this.dragging = false;
      },
      resize: true,
      zoom: 1,
      onResize: function (width, height) {
        var minSize = Math.min(width, height);
        this.zoom = minSize / 300;
        drawMaskCanvas()
      },
    });

    /*
    let box = new Zdog.Box({
      addTo: this.illo,
      width: 100,
      height: 100,
      depth: 100,
      stroke: false,
      color: '#C25', // default face color
      leftFace: '#EA0',
      rightFace: '#E62',
      topFace: '#ED0',
      bottomFace: '#636',
    });
    */

    // Create a Font object
    // You can use pretty much any .ttf or .otf font!
    // https://github.com/jaames/zfont#zdogfont

    var font = new Zdog.Font({
      //src: "fonts/arial-2038.ttf",
      src: "fonts/NeueHaasUnicaW1G-Bold/font.ttf",
      //src: "fonts/ArialUnicode-Bold.ttf"
    });

    // Create a Text object
    // Text objects behave like any other Zdog shape!
    // https://github.com/jaames/zfont#zdogtext
    this.text = new Zdog.Text({
      addTo: this.illo,
      translate: { z: 0, x: 0 },
      font: font,
      value: this.props.text,
      fontSize: 45,
      textAlign: "center",
      textBaseline: "middle",
      color: this.props.color,
      fill: true,
    });

    // Creating a darker duplicate of the text and pushing it backwards can help make it look like the text has depth
    // (This is entirely optional!)
    /*var shadow = text.copy({
      addTo: this.illo,
      translate: { z: -15 },
      color: '#aab' });*/

    // Animation loop
    const animate = () => {
      this.illo.updateRenderGraph();
      requestAnimationFrame(animate);
    };
    animate();
  };

  initVideo() {
    let videoElement = document.getElementById("video");

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        videoElement.play();
      });
  }

  // this is exposed to parent
  snap = () => {
    console.log("SNAP");
    const canvas = this.combineCanvas();
    return canvas.toDataURL("image/jpeg");
  };

  combineCanvas = () => {
    let videoElement = document.getElementById("video");
    let zdogCanvas = document.getElementById("zdog-canvas");
    let maskCanvas = document.getElementById("2038-canvas");

    let resultCanvas = document.getElementById("combined-result");
    resultCanvas.width = zdogCanvas.width;
    resultCanvas.height = zdogCanvas.height;

    let resultCanvasContext = resultCanvas.getContext("2d");
    console.log(videoElement);
    console.log(resultCanvas);

    // let ratio = videoElement.videoWidth / videoElement.videoHeight;

    let { width, height, x, y } = cover(
      resultCanvas.width,
      resultCanvas.height,
      videoElement.videoWidth,
      videoElement.videoHeight,
    );

    //console.log({ x, y, width, height });

    resultCanvasContext.drawImage(videoElement, x, y, width, height);
    resultCanvasContext.drawImage(maskCanvas, 0, 0, resultCanvas.width, resultCanvas.height);
    resultCanvasContext.drawImage(zdogCanvas, 0, 0);

    //this.setState({snapped: true});

    return resultCanvas;
  };

  controlVideo = () => {
    // console.log("control video called");
    let videoElement = document.getElementById("video");
    if (videoElement.play && this.props.blur) {
      // console.log("pause video");
      videoElement.pause();
    } else if (videoElement.pause && !this.props.blur) {
      // console.log("play video");
      videoElement.play();
    }
  };

  render() {
    return (
      <VideoContainer
        blur={this.props.blur}
      >
        {this.props.dev && (
          <SensorInfo>
            alpha: {this.state.orientation.alpha}
            <br />
            beta: {this.state.orientation.beta}
            <br />
            gamma: {this.state.orientation.gamma}
            <br />
            rotate x: {this.state.rotate.x}
            <br />
            rotate y: {this.state.rotate.y}
            <br />
            rotate z: {this.state.rotate.z}
          </SensorInfo>
        )}
        <Video id="video"></Video>
        <Canvas id="2038-canvas" width="600" height="800"></Canvas>
        <Canvas id="zdog-canvas" width="600" height="800"></Canvas>
        <Canvas
          id="combined-result"
          width="600"
          height="800"
          style={{
            pointerEvents: this.props.snapped ? "all" : "none",
            visibility: this.props.snapped ? "visible" : "hidden",
          }}
        ></Canvas>
      </VideoContainer>
    );
  }
}

const VideoContainer = styled.div`
  video {
    ${({ blur }) => blur && "filter: blur(10px);"}
  }
  canvas {
    ${({ blur }) => blur && "filter: blur(10px);"}
  }
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Video = styled.video`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas`
  display: block;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const SensorInfo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: black;
  z-index: 10;
`;
