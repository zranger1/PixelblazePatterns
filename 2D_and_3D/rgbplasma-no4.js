// simple,fast cosine plasma
//
// 01/30/2022 ZRanger1

export var scaleFactor = 1.5;
export var speed = 1.86;
var waveConst = [0.25,0,-0.5,.2887,-0.5,-0.3333]
var waveMult = array(6);

export function sliderSpeed(v) {
  speed = 5 * v;
}

export function sliderScale(v) {
  scaleFactor = 0.5+2*v;
}

translate(0.5,-0.5);

var t1;
export function beforeRender(delta) {
  t1 = time(1/speed * 0.1);
  arrayMapTo(waveConst, waveMult,(v,i,a) => (v * scaleFactor));
}

export function render2D(index,x,y) {
  var r,g,b;  
  r = wave(t1+(x * waveMult[0] + y * waveMult[1]));  
  g = wave((t1+r)+(x * waveMult[2] + y * waveMult[3]));   
  b = wave((r+g)-(x * waveMult[4] + y * waveMult[5])); 
  
  rgb(r,g,b);
}