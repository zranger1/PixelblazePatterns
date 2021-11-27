/*
 Darkstar 2D
 
 Playing with negative space a little...
 
 Adapted from GLSL shader "Hexagon" by @hintz 2013-05-07
 11/25/2021 ZRanger1
*/

// animation control variables
export var offset = 0.025;
export var speed = 0.9;
export var shift = 7;
var timebase = 0;


// UI - controls both speed and direction
export function sliderSpeed(v) {
  speed = -1+2*v;
}

export function sliderShifter(v) {
  shift = 1+floor(v * 15);
}


// 2D rotation about origin
var cosT = 0;  var sinT = 0;
var outX,outY;
function rotate2D(x,y) {
    outX = (cosT * x) - (sinT * y);
    outY = (sinT * x) + (cosT * y);
}

translate(-0.5,-0.5);

export function beforeRender(delta) {
  var theta;
  
  timebase = (timebase + delta/1000) % 1000;
  
  // set up rotation angle
  theta = speed*timebase*PI/3.0;
  cosT = cos(theta); sinT = sin(theta);
  
  // rotation rate for individual offset components
  offset = 0.275 * (cosT + sinT); 
}

export function render2D(index,x,y) {
  var r,g,b;
  var tmp;
  
    r = g = b = hypot(x,y)
    
    tmp = abs(offset-x)
    r *= tmp; g *= tmp;

    rotate2D(x,y);
    tmp = abs(offset-outX);
    p2 = outX;
    g *= tmp; b *= tmp;
    
    rotate2D(outX,outY);
    tmp = abs(offset-outX);
    p3 = outX;
    b *= tmp; r *= tmp;
    
    rotate2D(outX,outY);
    tmp = abs(offset-outX);
    r *= tmp; g *= tmp;
    
    rotate2D(outX,outY);
    tmp = abs(offset-outX);
    g *= tmp; b *= tmp;
    
    rotate2D(outX,outY);
    tmp = abs(offset-outX);
    b *= tmp; r *= tmp;
  
    g *= abs(x)<<shift; b *= abs(p2)<<shift; r *= abs(p3)<<shift;
    rgb(r,g,b); 
}