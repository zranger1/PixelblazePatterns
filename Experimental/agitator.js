// Agitator - distorted, wavelike...
// looks like the view into a top loading washing machine.
// ZRanger1 10/18/2021

var timebase = 0;
var t2;
export var speed = 4;
export var distortion = 0.1;

translate(-0.5,-0.5);
scale(2.25,2.25);

export function sliderSpeed(v) {
  speed = 0.1+(7*v);
}

export function sliderDistortion(v) {
  distortion = (v*v*0.3);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  t2 = time(0.08);
}

export function render2D(index,x,y) {
  var i,r,tmp;  
  
  for (i = 1; i < 3; i++) {
    x += cos(y*i*3) * distortion; 
    tmp = sin((x * x + y * y) - t1);
    x += tmp;  y += tmp;
    x += cos(x * 5) * distortion; 
    y += cos(y * 5) * distortion;
  }
  
  r = cos(x * 0.6); r *= r;
  hsv(t2+r,r*3,1-r);

}

