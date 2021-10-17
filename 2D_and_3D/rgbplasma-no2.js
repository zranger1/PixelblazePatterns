// Another sin/cos RGB plasma.  
// This one is smooth, bright and 
// sort of circle-y.
// 08/20/2021 - ZRanger1

var timebase = 0;
var t1,t2;
export var speed = .6;
export var scaleFactor = 0.8;
translate(-0.5,-0.5);

export function sliderSpeed(v) {
  speed = 0.25+(3*v);
}

export function sliderScale(v) {
  scaleFactor = max(0.4,v*2);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed
  resetTransform();
  translate(-0.5,-0.5)
  scale(scaleFactor,scaleFactor);
}

export function render2D(index,x,y) {
  var y1 = y;
  var x1 = x;
  
  for (var i = 1; i < 5; i++) {
    x1 += (1/i*cos(i*y*.8+t1));
    y1 += abs(1/i*sin(i*x*.8+t1));
    x = x1; y = y1;
  }

  r = wave(x); g = wave(y); b = wave(x * y);
  rgb(r*r,g*g,b*b);
}