// simple,fast cosine plasma
//
// 01/30/2022 ZRanger1

var scaleFactor = 2;
var speed = 1;
var waveConst = [4,-2,3.464]
var waveMult = array(3);
var isRadial = 0,isMirror = 0;

export function sliderSpeed(v) {
  speed = 5 * v;
}

translate(-0.5,-0.5);

var timebase;
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  arrayMapTo(waveConst, waveMult,(v,i,a) => (v * scaleFactor)) 
}

export function render2D(index,x,y) {
  var r,g,b;  
  r = 0.5+0.5*cos(t1+x * waveMult[0]);
  g = 0.5+0.5*cos(t1+(x * waveMult[1] + y * waveMult[2]));
  b = 0.5+0.5*cos(t1+(x * waveMult[1] + y * -waveMult[2]));  
  
  rgb(r*r,g*g,b*b);
}