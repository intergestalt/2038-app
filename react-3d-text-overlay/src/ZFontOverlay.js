import React from 'react';

import './ZFontOverlay.css';

export default class ZFontOverlay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      snapped: false,
      acceleration: {x: 0, y: 0, z: 0},
      rotate: {x: 0, y: 0, z: 0},
      orientation: {alpha: 0, beta: 0, gamma: 0}
    }
  }

  loadScript(src, onload) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = onload;
    document.body.appendChild(script);    
  }

  componentDidMount() {    
    
    this.initVideo();  

    // load zdog and zfont scripts and then init zfont
    this.loadScript("https://unpkg.com/zdog@1/dist/zdog.dist.min.js", ()=>{
      this.loadScript("https://cdn.jsdelivr.net/npm/zfont@latest/dist/zfont.min.js", ()=>{
        this.initZfont();
      })
    })

    // iOS 13+

    if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {

      window.DeviceOrientationEvent.requestPermission().then( function ( response ) {

        if ( response == 'granted' ) {

          window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false );
        }

      } ).catch( function ( error ) {

        console.error( 'Unable to use DeviceOrientation API:', error );

      } );

    } else {

      window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false );

    }



  }

  initZfont = ()=>{
    let Zfont = window.Zfont;
    let Zdog = window.Zdog;

    // Init Zfont plugin and bind to Zdog
    Zfont.init(Zdog);

    // Create Zdog Illustration
    // https://zzz.dog/api#illustration
    this.illo = new Zdog.Illustration({
      element: '#zdog-canvas',
      dragRotate: true,
      rotate: { x: 0, y: 0, z: 0 },
      onDragStart: () => {
        this.dragging = true;
      },
      onDragEnd: () => {
        this.dragging = false;
      },
      resize: true,
      zoom: 1,
      onResize: function (width, height) {
        var minSize = Math.min(width, height);
        this.zoom = minSize / 300;
      } });

    // Create a Font object
    // You can use pretty much any .ttf or .otf font!
    // https://github.com/jaames/zfont#zdogfont


    var font = new Zdog.Font({
      src: 'fonts/wts11.ttf' });

    // Create a Text object
    // Text objects behave like any other Zdog shape!
    // https://github.com/jaames/zfont#zdogtext
    var text = new Zdog.Text({
      addTo: this.illo,
      translate: { z: 0, x: 25 },
      font: font,
      value: this.props.text,
      fontSize: 30,
      textAlign: 'center',
      textBaseline: 'middle',
      color: '#fff',
      fill: true });

    // Creating a darker duplicate of the text and pushing it backwards can help make it look like the text has depth
    // (This is entirely optional!)
    /*var shadow = text.copy({
      addTo: this.illo,
      translate: { z: -15 },
      color: '#aab' });*/

    // Animation loop
    const animate = ()=> {
      this.illo.updateRenderGraph();
      requestAnimationFrame(animate);
    }
    animate();
  }

  initVideo() {
    let videoElement = document.getElementById("video");
    
    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      videoElement.srcObject = stream;
      videoElement.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      videoElement.play();
    });
  }

  combineCanvas = ()=> {
    let videoElement = document.getElementById("video");
    let zdogCanvas = document.getElementById("zdog-canvas");
    
    let resultCanvas = document.getElementById("combined-result");
    let resultCanvasContext = resultCanvas.getContext("2d");
    console.log(videoElement);

    resultCanvasContext.drawImage(videoElement, 0, 0, resultCanvas.width, resultCanvas.height);     
    resultCanvasContext.drawImage(zdogCanvas, 0, 0, resultCanvas.width, resultCanvas.height);

    this.setState({snapped: true});
  }

  onDeviceOrientationChangeEvent = (event) => {

    this.setState({orientation: event});
    this.setState({rotate: this.illo.rotate});
    if(this.dragging) return;

    if(!this.alphaOffset) this.alphaOffset = event.alpha;

    if(this.illo) {

      let newY = (event.alpha / 360) * (2 * Math.PI)
      this.illo.rotate.y = newY;  

      // beta = 0 when flat on table, 90 when upright
      let newX = (event.beta - 90) / 90 * (Math.PI / 2)
      this.illo.rotate.x = newX;
      
    }
  }

  render() {
    return( 
        <div>
          <div id="sensor-info">
            alpha: {this.state.orientation.alpha}<br/>
            beta: {this.state.orientation.beta}<br/>
            gamma: {this.state.orientation.gamma}<br/>
            rotate y: {this.state.rotate.y}<br/> 
            rotate x: {this.state.rotate.x}<br/> 
            rotate z: {this.state.rotate.z}
          </div>
          {!this.state.snapped && <video id="video"></video>}
          <canvas id="combined-result" width="600" height="800"></canvas>
          {!this.state.snapped && <canvas id="zdog-canvas" width="600" height="800"></canvas>}
          {!this.state.snapped && <input id="snap-button" type="button" value="snap" onClick={this.combineCanvas}/>}
        </div>
    ); 
  }
}



    
      
    
  


