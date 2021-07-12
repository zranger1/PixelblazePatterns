/*
  Basic green "The Matrix"-style waterfall display adapted for 
  2D LED displays. 
  
  Not a perfect reproduction, but extremely lightweight and fast enough
  to be usable as a background or a texture in another pattern.
   
   7/10/21 JEM(zranger1)
*/

var speed = 20;
var hue = 0.3333;

export function sliderSpeed(v) {
  speed = floor(50 * v);
}

export function beforeRender(delta) {
  t1 = speed*time(.25)+0.02;
  w = (pixelCount / 2) + (0.5*time(.3))
}

export function render2D(index,x,y) {
  var v = mod(y-t1,wave(x*w)); v = v * v;
  hsv(hue, 1-((v > 0.8)/12), v);
}