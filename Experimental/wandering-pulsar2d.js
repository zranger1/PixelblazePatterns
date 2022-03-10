// Sunwheel2d
// Another radial experiment
// 3/9/2022 ZRanger1 
//

export var speed = 1;
export var complexity = 0.2;
var timebase = 0;
var orbitX,orbitY,core;
var t1,t2,t3,t4;

// UI Controls
export function sliderComplexity(v) {
  complexity = 0.5*v*v;
}

export function sliderSpeed(v) {
  speed = 1 + v * 3;
}

// move (0,0) to center of display
translate(-0.5,-0.5);

// uncomment scale() to zoom out and see what's really going on!
//scale(5,5)

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = timebase * speed;
  t2 = t1 * 12;
  t3 = t1 * 3;
  t4 = t1 * 7;
  orbitX = sin(t1 * 0.5) * 0.275;
  orbitY = sin(t1 * 0.8) * 0.275;
  core = 0.925+0.22*sin(t1 * 4);
}

export function render2D(index,x,y) {
  // move incoming coords in an elliptical orbit and convert
  // to radial form, centered on the display.
  x += orbitX; y += orbitY;
  var len = core-hypot(x,y);
  theta = atan2(y,x);
  
  // red is a rough, 3-lobed wave
  r = (len*len) + sin(theta * 15 + t2 + sin(theta * 7 + t3) * .1) *
  complexity+sin(theta * 3 + t4) * .55;
  
  // g is brightest at the center of the lobes
  g = (r < 0) ? r : r * sin(r);

  // constant b makes the brightest areas sunny yellow and the background
  // a pleasant blue.
  rgb(r,g,0.25)
}