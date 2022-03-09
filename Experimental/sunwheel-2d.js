// Sunwheel2d
// Another radial experiment
// 3/9/2022 ZRanger1 
//
var timebase = 0;
var orbitX,orbitY;

translate(-0.5,-0.5);
// uncomment scale() to zoom out and see what's really going on!
//scale(5,5)

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = timebase;
  orbitX = sin(t1 * 0.5) * 0.35;
  orbitY = sin(t1 * 0.8) * 0.35;
}

export function render2D(index,x,y) {
  // move incoming coords in an elliptical orbit and convert
  // to radial form, centered on the display.
  x += orbitX; y += orbitY;
  var len = 1.1-hypot(x,y);
  theta = atan2(y,x);
  
  // red is a rough, 3-lobed wave
  r = (len*len) + sin(theta * 15 + t1 * 2 + sin(theta * 7 + t1 *13) * 0.1) *
  0.2+sin(theta * 3 + t1 * 7) * .5;
  // g is brightest at the center of the lobes
  g = (r < 0) ? r : r * sin(r);

  // constant b makes the brightest areas sunny yellow and the background
  // a pleasant blue.
  rgb(r,g,0.25)
}