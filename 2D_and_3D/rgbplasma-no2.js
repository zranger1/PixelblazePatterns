// Another RGB plasma, made with mostly triangle waves
// This one is smooth, bright and 
// has a liquid feel
// 11/06/2021 - ZRanger1

var timebase = 0;
var t1,t2;
export var speed = .1546;
export var scaleFactor = 0.565;
export var isRadial = 0;
export var isMirror = 0;
translate(-0.5,-0.5);

export function sliderSpeed(v) {
  speed = 0.025+ v * v;
}

export function sliderScale(v) {
  scaleFactor = 0.01 + (v * 2);
}

export function sliderRadial(v) {
  isRadial = (v > 0.5);
}

export function sliderMirror(v) {
  isMirror = (v > 0.5);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed
}

var t2;
export function render2D(index,x,y) {
  if (isMirror) {x = -abs(x); y = -abs(y);}
  if (isRadial) {tmp = atan2(y,x); y = hypot(x,y); x = tmp;}
    
  var y1 = y;
  var x1 = x;
  
  for (var i = 1; i < 5; i++) {
    x1 += scaleFactor/i*wave(triangle(i*y*.1+t1));
    y1 += scaleFactor/i*wave(triangle(i*x*.3+t1));
    x = x1; y = y1;
  }

  r = triangle(x+t1); g = triangle(y-t1); b = triangle(t1+x*y);
  rgb(r*r,g*g,b*b);
}