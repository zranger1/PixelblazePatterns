// Twisting line effect - basic idea from a PC screensaver I saw
// long, long ago.  No idea where.
// Re-imagined to be uniquely Pixelblaze-y
//
// Now with twist control and kaleidoscopic mirroring
// 10/26/2021 - ZRanger1

var timebase = 0;
var t1;
var zoom;
export var speed = 4.6;
export var twist = 1.75;
export var nSides = 1;
var slice = PI / nSides;

translate(-0.5,-0.5);

export function sliderSpeed(v) {
  speed = 1+(9*v);
}

export function sliderTwist(v) {
  twist = 1.25+(0.75*v);
}

export function sliderReflections(v) {
  nSides = 1+floor(6*v);
  slice = PI / nSides;
}

// sets up a kaleidoscope effect - makes the image repeat over evenly divided
// rotated "slices" about the center.
var outx,outy;

function kal(x,y,t1) {
  var angle = atan2(y, x);
  angle = mod(angle, 2.0 * slice);
  
  // uncomment to reflect each slice so they can be tiled
  // evenly if you like.
  //angle = abs (angle - slice);
  
  // rotate image over time
  angle += PI*timebase;
  
  // map new rotated coordinates back to original image space
  var d = hypot(x,y);
  outx = d * cos(angle);  outy = d * sin(angle);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  zoom = wave(time(0.075));
}

export function render2D(index,x,y) {
  var h,b,radius,theta;  
  
  if (nSides > 1) { kal(x,y,t1); x = outx; y = outy; }
  
  radius = twist-hypot(x,y)*2.4;
  theta = radius * radius * sin(radius + t1);
  x = (cos(theta) * x) - (sin(theta)* y);

  b = 1-wave(x*4.6*zoom);
  h = (x * zoom)+ zoom + theta/PI2;
  hsv(h,1,b*b);
}