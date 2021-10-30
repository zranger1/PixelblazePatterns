// Sea Star 2D
//
// 10/27/2021 ZRanger1

var timebase;
export var complexity = 1.5;
export var nSides = 5;
export var speed = 1.75;
var slice = PI / nSides;
var waveScale = 8;       // larger values == more complex waves
var contrast = 0.02023;  // smaller values == higher contrast

translate(-0.5,-0.5)
scale(.5,.5)

export function sliderSpeed(v) {
  speed = (4 * v);
}

export function sliderComplexity(v) {
  complexity = 1+(1.5*v);
}

export function sliderReflections(v) {
  nSides = 1+floor(v * 15);
  slice = PI / nSides;  
  waveScale = 8;  
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t = timebase * speed; 
  t2 = t / 2 * complexity;
}

// sets up a kaleidoscope effect - makes the image repeat over evenly divided
// rotated "slices" about the center.
var x1,y1,s,temp;
export function render2D(index,x,y) {
  var r,g,b;
  
  // fold coordinate space across our slices
  var angle = atan2(y, x);
  angle = mod(angle, 2.0 * slice);
  
  // rotate image over time
  angle += t;
  
  // map new rotated coordinates back to original image space
  var d = hypot(x,y);
  x1 = 1-(d * cos(angle) * waveScale + t2);
  y1 = d * sin(angle);  
  
  // draw a few iterations of our wave function over a short time interval  
  for (i = 0; i < 3;i++) {
    y1 += sin(x1*(i*complexity) + (t + i/complexity)) * 0.5;
    b += i * abs(contrast/y1);
  }

  b = clamp(b,0,1);
  hsv(0.6667 - (0.075 * b),1,b)
}