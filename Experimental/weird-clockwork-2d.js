// Weird Clockwork
// This is doing something interesting and important,
// I just have no idea what it is!
//
// Another radial spinning experiment. Needs a little more polish.
//
// 03/09/2022 ZRanger1

var timebase = 0;

translate(-0.5,-0.5);
//scale(.10,.10);
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = timebase * 5;
}

export var r,l;
export function render2D(index,x,y) {
  rad = frac(x*x+y*y); 
  ang = atan2(y,x);
  t = timebase + .02*wave(timebase)/rad;
  xs = sin(PI*rad+t);
  
  l = 0.65*(sin(t) + sin(t1 + ang * 4)); 

  r = -sin(rad*5+ang-t1+xs);
  g = sin(rad * 16+ang-t1+xs);
  b = cos(rad+ang*.2+ang+t1)-xs;
  
  // normalize
  m = max(r,max(g,b));
  r = r / m; g = g/m; b = b/m;
  r = r * l ;g = g * l; b = b * l;  
  
  rgb(r,g,b)
}