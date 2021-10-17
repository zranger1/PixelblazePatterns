// Endless tunnel of spiraling squares
// Stare at it long enough and optical illusion makes it seem
// like the background is moving too.  
//
// MIT License
// Take this code and make something cool!
// 8/25/2021 ZRanger1

var t2;
export var speed = 5;
export var nSquares = 4;
var cosT = cos(0.1), sinT = sin(0.1);

function signum(a) {
  return (a > 0) - (a < 0)
}

export var speed = 5;
var timebase;

export function sliderSpeed(v) {
  speed = 1+9* v;
}

export function sliderSquarocity(v) {
  nSquares = 1+floor(6*v);
}

translate(-0.5,-0.5); 

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t2 = time(0.08);
  t1 = speed * timebase;
}

// squared spiral expression adapted from https://www.shadertoy.com/view/4tlfRB  
export function render2D(index,x,y) {
  x1 = signum(x); y1 = signum(y);
  sx = x1 * cosT + y1 * sinT;
  sy = y1 * cosT - x1 * sinT;

  dx = abs(sin(nSquares*log(x * sx + y * sy) + atan2(y,x) - t1))
  
  hsv(t2 + x*sx + y*sy, 1, dx * dx * dx)
}