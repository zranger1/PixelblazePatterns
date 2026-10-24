// Boxplosion 2D - An explosion of brightly colored boxes!
//
// MIT License
// Take this code and use it to make cool things!
//
// 6/12/2022 - ZRanger1 
// 10/23/2026 - updated to add a little more movement. 
//

var iterations = 3;  
var timebase = 0;
var t1,t2,t3;
var theta = 0;
export var bScale = 6;

export function sliderScale(v) {
  bScale = 4 + round(v *5)
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  t1 = timebase * 2;
  t2 = mod(t1,2); t2 = t2*t2*t2;
  t3 = 0.05 * (sin(t1*2));
  theta += t3;
  t3 = abs(t3);
  
  resetTransform()
  translate(-0.5,-0.5);
  rotate(theta)
  scale(bScale,bScale)  
  
}

export function render2D(index,u,v) {
  var a = 1;

  // all the sub-boxes are always present -- they just move
  // as a function of the variable t3, which is some fraction 
  // of abs(sin(time)).
  for (var x = 0; x < iterations; ++x)     {
    for (var y = 0; y < iterations; ++y) {
      px = (x / (iterations-1) - 0.5) * t2;
      py = (y / (iterations-1) - 0.5) * t2;
      a = min(a, max(abs(u-px)-t3,abs(v-py)-t3));
    }
  }
  a = 1-clamp(a,0,1);
  hsv(a,1,a);
}