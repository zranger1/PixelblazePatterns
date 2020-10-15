/*
 Absolutely Accurate Simulation of a failing fluorescent tube.  
 
 Flickering ends, periodic arc failure, mercury depletion... 
 It'll remind you of why we loved these things!
 
 Has one control -- awfulness.  At zero, behaves like
 a normal, working tube.  At one... watch out!
 
 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 10/13/2020 
 
*/ 

// GLOBAL VARIABLES
// animation management
export var awfulness = 0;
export var glitchProbability = 0.995;

var glitch = false;      // startup glitching enable flag
var arc = false;         // arc failure enable flag
var glitchClock = 0;     // timer for current glitch state
var glitchDuration = 0;  // total length (ms) of current glitch state
var flickerSpeed = calcFlicker(20);  // end flicker frequency
var endbri = 0.04;       // brightness of dying tube ends

// "normal" cool white fluorescent tube color
var cwhue = 0.961;
var cwsat = 0.102;
var cwbri = 0.8;

// color of dying tube - mercury gone, argon glowing pinkly...
var failhue = 0.01;
var failsat = 0.6;
var failbri = 0.3;

// length of the tube "end" - the part we'll dim and flicker
// as awfulness increases
var endlen = floor(pixelCount/8);

// initialize light to normal cool white
var hue = cwhue;
var sat = cwsat;
var bri = cwbri;

// convert hertz to PB time()
function calcFlicker(hz) {
  return (1/hz) / 65.536;
}

// UI controls
export function sliderAwfulness(v) {
    awfulness = v;
  
// tube reddens and dims as it ages  
    hue = cwhue - ((failhue - cwhue) * v);
    sat = cwsat + ((failsat - cwsat) * v);
    bri = cwbri - (0.6 * v);

// probability and severity of arc failure increases
    glitchDuration = 500 * awfulness;
    glitchProbability = 1 - (.005 * awfulness);
    glitchSpeed = 0.03;
    
// ends dim and flicker    
    endbri = clamp(0.8 - (4 * v),0.1,cwbri);
    flickerSpeed = calcFlicker(60 - (40 * v));
}

var t1,t2;
export function beforeRender(delta) {
  glitchClock += delta;
  t1 = time(flickerSpeed); 
  t2 = time(glitchSpeed);   
  
  if (glitch && (glitchClock > glitchDuration)) {
    glitch = false;
    arc = false;
    hue = cwhue;
    sat = cwsat;
    bri = cwbri;
  }
  else if (random(1) > glitchProbability) {
    glitch = true;
    arc = (random(1) > (0.75 * awfulness));
    glitchClock = 0;
    glitchDuration = 500 * random(1);
    hue = failhue;
    sat = failsat;
    bri = failbri;     
  }
}

export function render(index) {
  var h,s,b;
  h = hue; s = sat; b = bri;
  ick = (awfulness > 0.5);
  
  if ((index <= endlen) || (index > (pixelCount - endlen))) {
    b = (ick) ? t1 * endbri : endbri;
    hsv(cwhue,cwsat,b);
  }
  else {
    b = (ick && arc) ? failbri * sin((t2 * pixelCount ) - (4 * (index / pixelCount))) : b;    
    hsv(h,s,b)
  }
}