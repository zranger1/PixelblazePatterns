// Weird colorful pinwheel thing.  Still figuring
// out what to do with this...
//
// MIT License
// 2/25/2022 ZRanger1

export var speed = 1;

export function sliderSpeed(v) {
  speed = min(3,0.5 + v*3);
}

translate(-0.5,-0.5);
//scale(1.25,1.25);

export function beforeRender(delta) {
  timebase = time(0.15) * 10
  t1 = timebase * speed;
}

export function render2D(index,x,y) {
  d = 1-wave(hypot(x,y) - t1);  // waves
  a = abs(atan2(x,y)-t1) % (2-wave(time(0.2)));  // rays
  
  b = max(a,d); 
  hsv(b-d,a+b,b*b*b)
}