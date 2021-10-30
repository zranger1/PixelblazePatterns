/*
   Simple additive sine/cosine plasma, mirrored along
   both axes.
   
   From prototype in GLSL, just to see if a Pixelblaze 3
   can manage all the trig.  Spoiler:  It can! 
   
   Adjust scale and speed to suit your display.  There's
   interation between the two, so play with it a bit.

   7/09/21 JEM(zranger1)
*/
export var sc = 1.5;
export var speed = 1.1;
export var s2;
export var isRadial = 0;
export var isMirror = 0;
var timebase,t1,t2,t3;

translate(-0.5,-0.5);
scale(sc,sc);

export function sliderSpeed(v) {
  speed = 5 * v;
  s2 = (1-v) / 10;
}

export function sliderRadial(v) {
  isRadial = (v > 0.5);
}

export function sliderMirror(v) {
  isMirror = (v > 0.5);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = speed * timebase;
  t2 = wave(time(s2));
  t3 = 1-t2;
}

export function render2D(index,x,y) {
  if (isMirror) {x = -abs(x); y = -abs(y);}
  if (isRadial) {tmp = atan2(y,x); y = hypot(x,y); x = tmp;}
  
  // "distort" coordinates by adding waves at 3 different scales
  x += sin(t1 + y * (PI2 * t2));
  y += cos(t1 + x * (PI2 * t3));
  
  x += sin(t1 + y * t3);
  y += cos(t1 + x * t2);
  
  x += sin(t1 + y);
  y += cos(t1 + x);
  
  // convert to RGB color.
  r = wave((t1 + x)/PI2);
  g = wave((t1 + (y + 4))/PI2)
  b = wave((t1 + (x + 3))/PI2);

  rgb(r*r,g*g,b*b)
}