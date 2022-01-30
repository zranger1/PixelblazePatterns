// fake water caustics
// Part of the search for a nice 2D water pattern for 
// lighting.  This looks a lot like voronoi noise, but it's
// not - just  sin/cos circles.  
//
// 1/27/2022 ZRanger1

var timebase = 0;
var iterations = 3;
var inten = 1/24;
var whiteLevel = 1.125;

export function sliderWhiteLevel(v) {
  whiteLevel = 0.8 + (1-v)
}

//scale(3,3)
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase / 6;
}


export function render2D(index,x,y) {
  var px = x * PI2 - 20;  py = y * PI2 - 20;
  var ix = px; var iy = py;
  var c = 1;
  
  // accumulate lumpy circular "waves"
  for (var n = 0; n < iterations; n++) {
    var t = t1 * (1-(3.5/n+1));
    tmp = px + cos(t - ix) + sin(t + iy); 
    iy = py + sin(t - iy) + cos(t + ix);
    ix = tmp;

    c += 1/hypot(px/sin(t + ix)*inten, py/cos(t + iy)*inten)
  }
  
  // scale and gamma correct
  c = 1.55-sqrt(c/iterations);
  c = c * c * c * c;
  c = clamp(c,0,1);
  
  hsv(0.6667- (0.3 * c),whiteLevel-c,c)
  
}