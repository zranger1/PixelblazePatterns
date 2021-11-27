// All Lasers, Fire!
// A demonstration of the power of this 
// fully armed and operational battle station.
//
// (also shows how the tan() function and a little
// division can make a pattern that shifts between
// chaos and order)
//
// MIT License
// Take this code and use it to make cool things!
// 
// Best on a 2D display with appropriate mapping function,
// but also works on 1D strips.
//
// 10/31/2021 ZRanger1

// Global variables and precalculated values to save rendering time
export var blastScale = 5;  // general size of "laser" effects
export var speed = 0.3;
var time2;
var colorSpacing = .0002;  // world coord % space between color layers
var dHyp = hypot(colorSpacing,colorSpacing);
var dT = .04;              // timebase offset between colors
var wr,wg,wb;              // offset envelopes for each color
var zap;

// UI Sliders

export function sliderSpeed(v) {
  v = 1-v;
  speed =  0.0001+(v*v*v);
}

export function sliderBlastScale(v) {
  blastScale = .1+10*v;
}

export function beforeRender(delta) {
  timebase = time(speed);
  time2 = timebase * PI2;
  
  zap = (1-timebase) * 0.03;
  wr = blastScale+wave(timebase);
  wg = blastScale+wave(timebase+dT);
  wb = blastScale+wave(timebase+dT+dT);
}

export function render2D(index,x,y) {
  var r,g,b;
  var px,py,tmp;
  var u,v;
  var len;

  // adjust coord system so the lasers are firing from the bottom up
  // change this if needed to suit your display.
  y = 1-y;

  // render color layers - red
  len = hypot(x,y)
  px = x; py = y;
  z = time2; 
  tmp =  len * wr * (tan(len * zap- z));
  r = 0.075/hypot(mod(px/tmp,1)-0.55,mod(py/tmp,1)-0.55) / len
  r = r * r * r ;
  
  // green
  px -= colorSpacing;  py -= colorSpacing;
  len -= dHyp;     
  z += dT;
  tmp =  len * wg * (tan(len * zap - z));
  g = 0.075/hypot(mod(px/tmp,1)-0.55,mod(py/tmp,1)-0.55) / len
  g = g * g * g;
  
  // blue
  px -= colorSpacing;  py -= colorSpacing;
  len -= dHyp;     
  z += dT;
  tmp =  len * wb * (tan(len * zap - z));
  b = 0.075/hypot(mod(px/tmp,1)-0.55,mod(py/tmp,1)-0.55) / len
  b = b * b * b;
  
  rgb(r,g,b);
}

// for use on 1D strips
var xdim = sqrt(pixelCount) * 4;
export function render(index) {
  x = index / xdim;
  render2D(index,x,0)  ;

}
