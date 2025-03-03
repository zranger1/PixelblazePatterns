// Time-lapse video of traffic moving around city blocks...
//
// Playing around with coordinate distortion, and fractals related to
// the Minsky circle algorithm, I found this by accident.  It's hard to 
// describe, hard to photograph, but hypnotic as heck.
//
// Here's the conversation that got me started in this direction:
//     https://forum.electromage.com/t/minsky-circle-algorithm/1532
//
// Requires a 2D display.
//
//  MIT LICENSE
//
// 5/2024 ZRanger1

export var repeats = 4
export var speed = 2.25;
export var lineWidth = 0.0775;
export var s = 1
export var calcMode = 0;

var numModes = 4
var modes = array(numModes)

// pretty much any dyadic function will work
modes[0] = (x,y) => (x + y)
modes[1] = (x,y) => max(x,y)
modes[2] = (x,y) => x * y
modes[3] = (x,y) => hypot(x,y)

var xWeight;
var yWeight;

// UI 
export function sliderLineWidth(v) {
  lineWidth = mix(0.05,0.2,v*v);
}

export function sliderSpeed(v) {
  speed = 1 + 2 * (1-v)
  moveSpeed = 4 * 3 - speed;  
}

export function sliderRepeats(v) {
  repeats = 1+floor(v * 5);
}

export function sliderScale(v) {
  s = mix(0.75,2,v)
}

export function sliderMode(v) {
  calcMode = floor(v * (numModes - 1))
}

var timebase = 0;
var t1 = 0;
export function beforeRender(delta) {
  delta /= 1000 * speed;
  timebase = (timebase + delta) % 3600;
  
  // timer t1 drives the output pattern's overall shape. 
  // as usual with fractal-ish things, we limit the range
  // to the "interesting" region.
  t1 = 0.4+(timebase / 3) % 16

  yWeight = .005*sin(timebase);
  xWeight = 1 - yWeight
  
  resetTransform();
  translate(-0.5,-0.5)
  scale(s,s)
}

export function render2D(index,x,y) {
  // change the x coord, then change y using modified x
  // this is the heart of the minsky circle algorithm
  x = x * xWeight + y * yWeight;
  y = y * xWeight - x * yWeight;
  
  // tile the pattern across the display
  x = abs(mod(x * repeats,2) - 1) * 4;
  y = abs(mod(y * repeats,2) - 1) * 4;
  
  c = lineWidth/(lineWidth+abs(sin(t1 * modes[calcMode](x,y))));

  hsv(timebase+c * 0.25,1.5-c,c * c);
}

