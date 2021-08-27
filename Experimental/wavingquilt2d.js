// Waving Quilt 2D
// Colorful waving squares.
// Ported from GLSL shader of unknown origin
//
// 08/20/2021 - ZRanger1

var timebase = 0;
var t1,t2;
export var speed = 1.5;
export var scaleFactor = 1;
translate(-0.5,-0.5);

export function sliderSpeed(v) {
  speed = 1+(3*v);
}

export function sliderScale(v) {
  scaleFactor = max(0.6,v*2);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed
  resetTransform();
  scale(scaleFactor,scaleFactor);
}

export function render2D(index,x,y) {
  var x1 = x;
  var y1 = y;
  for (var i = 1; i < 5; i++) {
    x1 -= 0.3/i*sin(i*y*.4+t1);
    y1 += 0.3/i*sin(i*x*.4+t1);
    x = x1; y = y1;
  }

  r = x - floor(x); g = y - floor(y); b = x * y * 10;
  rgb(r,g,b);
}