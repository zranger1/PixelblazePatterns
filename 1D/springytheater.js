// traditional "theater style" chaser lights, with constantly
// changing intervals between the lights
//
// Version 1.0.0 JEM(ZRanger1) 07/20/2020 

var m;
export function beforeRender(delta) {
  t1 = floor(time(0.3) * pixelCount)
  m = max(2,floor(triangle(time(0.1)) * 10)); 
}

export function render(index) {
  v = ((t1 + index) % m) ? 0: 1
  hsv(t1/pixelCount, 1, v)
}