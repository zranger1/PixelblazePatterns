// Twisting line effect - basic idea from a PC screensaver I saw
// long, long ago.  No idea where.
// Re-imagined to be uniquely Pixelblaze-y
//
// 08/03/2021 - ZRanger1


var timebase = 0;
var t1;
var zoom;
export var speed = 7;
export var twist = 2.4

translate(-0.5,-0.5);

export function sliderSpeed(v) {
  speed = 1+(9*v);
}

export function sliderTwist(v) {
  twist = 1.25+(0.75*v);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  zoom = wave(time(0.075));
}

export function render2D(index,x,y) {
  var h,b,radius,theta;  
  
  radius = twist-hypot(x,y)*2.4;
  theta = radius * radius * sin(radius + t1);
  x = (cos(theta) * x) - (sin(theta)* y);

  b = 1-wave(x*4.6*zoom);
  h = (x * zoom)+ zoom + theta/PI2;
  hsv(h,1,b*b);
}