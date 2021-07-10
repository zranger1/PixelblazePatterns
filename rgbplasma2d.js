/*
   Simple additive sine/cosine plasma.
   
   From prototype in GLSL, just to see if a Pixelblaze 3
   can manage all the trig.  Spoiler:  It can! 
   
   Adjust scale and speed to suit your display.  There's
   interation between the two, so play with it a bit.

   7/09/21 JEM(zranger1)
*/
var t2;
export var scale = 1.6;
export var speed = 50;

export function sliderScale(v) {
  scale = 4*v;
}

export function sliderSpeed(v) {
  speed = 100 * v;
}

export function beforeRender(delta) {
  t1 = speed * wave(time(0.6)); // base timer
}

export function render2D(index,x,y) {
  
  // center and rescale coordinates so they'll cause an 
  // interesting amount of movement in sin/cos
  x = scale * (x - 0.5); y = scale * (y - 0.5);
  
  // "distort" coordinates by adding waves at 3 different scales
  x += sin(t1 + y);
  y += cos(t1 + x);
  
  x += sin(t1 + y * 2);
  y += cos(t1 + x * 2);
  
  x += sin(t1 + y * 3);
  y += cos(t1 + x * 3);
  
  // convert to RGB color.
  r = 0.5 + 0.5 * cos(t1 + x);
  g = 0.5 + 0.5 * cos(t1 + (y + 3))
  b = 0.5 + 0.5 * cos(t1 + (x + 5));

  rgb(r*r,g*g,b*b)
}