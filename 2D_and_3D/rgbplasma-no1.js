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
export var speed = 50;
var timebase;

translate(-0.5,-0.5);
//scale(sc,sc);

export function sliderSpeed(v) {
  speed = 10* v;
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = speed * timebase;
}

export function render2D(index,x,y) {
  x = -abs(x); y = -abs(y);

  // "distort" coordinates by adding waves at 3 different scales
  x += sin(t1 + y * 3);
  y += cos(t1 + x * 3);
  
  x += sin(t1 + y * 2);
  y += cos(t1 + x * 2);
  
  x += sin(t1 + y);
  y += cos(t1 + x);
  
  // convert to RGB color.
  r = wave((t1 + x)/PI2);
  g = wave((t1 + (y + 4))/PI2)
  b = wave((t1 + (x + 3))/PI2);

  rgb(r,g,b)
}