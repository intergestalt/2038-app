import React from 'react';
import './ZFontOverlay.css';

export default class ZFontOverlay extends React.Component {

  loadScript(src, onload) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = onload;
    document.body.appendChild(script);    
  }

  componentDidMount() {    
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
      element: '.zdog-canvas',
      dragRotate: true,
      rotate: { x: -0.32, y: 0.64, z: 0 },
      resize: 'fullscreen',
      zoom: 1,
      onResize: function (width, height) {
        var minSize = Math.min(width, height);
        this.zoom = minSize / 420;
      } });

    // Create a Font object
    // You can use pretty much any .ttf or .otf font!
    // https://github.com/jaames/zfont#zdogfont
    var font = new Zdog.Font({
      src: 'https://cdn.jsdelivr.net/gh/jaames/zfont/demo/fredokaone.ttf' });

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

  render() {
    return( 
      <canvas className="zdog-canvas" width="420" height="420"></canvas>
    ); 
  }
}