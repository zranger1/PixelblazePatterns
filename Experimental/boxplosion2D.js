// Boxplosion 2D - An explosion of brightly colored boxes!
//
// MIT License
// Take this code and use it to make cool things!
//
// 6/12/2022 ZRanger1
//

var iterations = 3;  
var timebase = 0;
var t1,t2,t3;

translate(-0.5,-0.5);
scale(4,4)
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  t1 = timebase * 2;
  t2 = mod(t1,2); t2 = t2*t2*t2;
  t3 = 0.05 * abs(sin(t1*2));
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