// Weird Clockwork
// I... have no idea what this is. Uses radial-ized coords
// as input into trig functions.  Interesting, but messy.
// Needs a little more work.
// 03/11/2022 ZRanger1

var timebase = 0;

translate(-0.5,-0.5);
//scale(.10,.10);
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
}

export var r,l;
export function render2D(index,x,y) {
  rad = hypot(x,y);
  ang = atan2(y,x);
  t = timebase + .1/rad;
  xs = sin(PI*rad+t);
  
  l = abs(0.65*(sin(t) + sin(timebase + ang * 4))); 

  r = -sin(rad*5+ang-timebase+xs);
  g = sin(rad * 3+ang-timebase+xs);
  b = cos(rad+ang*2+ang+timebase)-xs;
  
  // normalize
  m = max(r,max(g,b));
  r = r / m; g = g/m; b = b/m;
  r = r * l ;g = g * l; b = b * l;  
  
  rgb(r,g,b)
}