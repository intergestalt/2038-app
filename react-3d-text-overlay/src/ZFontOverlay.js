import React from 'react';
import './ZFontOverlay.css';

export default class ZFontOverlay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      snapped: false
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

  }

  initZfont() {
    let Zfont = window.Zfont;
    let Zdog = window.Zdog;

    // Init Zfont plugin and bind to Zdog
    Zfont.init(Zdog);

    // Create Zdog Illustration
    // https://zzz.dog/api#illustration
    var illo = new Zdog.Illustration({
      element: '#zdog-canvas',
      dragRotate: true,
      rotate: { x: -0.32, y: 0.64, z: 0 },
      resize: true,
      zoom: 1,
      onResize: function (width, height) {
        var minSize = Math.min(width, height);
        this.zoom = minSize / 420;
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
      addTo: illo,
      font: font,
      value: this.props.text,
      fontSize: 50,
      textAlign: 'center',
      textBaseline: 'middle',
      color: '#fff',
      fill: true });

    // Creating a darker duplicate of the text and pushing it backwards can help make it look like the text has depth
    // (This is entirely optional!)
    var shadow = text.copy({
      addTo: illo,
      translate: { z: -6 },
      color: '#aab' });

    // Animation loop
    function animate() {
      illo.updateRenderGraph();
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

  render() {
    return( 
      <div>
        {!this.state.snapped && <video id="video"></video>}
        <canvas id="combined-result" width="800" height="600"></canvas>
        {!this.state.snapped && <canvas id="zdog-canvas" width="800" height="600"></canvas>}
        {!this.state.snapped && <input id="snap-button" type="button" value="snap" onClick={this.combineCanvas}/>}
      </div>
    ); 
  }
}