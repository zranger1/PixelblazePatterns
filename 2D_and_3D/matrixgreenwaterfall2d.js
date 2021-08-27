/*
  Basic green "The Matrix"-style waterfall display adapted for 
  2D LED displays. 
  
  Not a perfect reproduction, but captures the feel pretty well,
  and the code is small and fast enough to be usable as a background
  or a texture in another pattern.
   
   7/15/21 JEM(zranger1)
*/

var speed = 20;
var hue = 0.3333;

// You may want to adjust wavebase for seriously non-rectangular
// displays.  Half the number of x axis pixels is a good place
// to start.
var waveBase = (sqrt(pixelCount) / 2);

// uncomment mod() function for pixelblaze 2
//function mod(dividend, divisor) {
//  var r = dividend % divisor;
//  return (r > 0) != (divisor > 0) ? r + divisor : r;
//}

export function sliderSpeed(v) {
  speed = floor(50 * v);
}

export function beforeRender(delta) {
  t1 = speed*(time(.25)+0.02);
  w = waveBase + (0.5*time(.3))
}

export function render2D(index,x,y) {
  var v = mod(y-t1,wave(x*w)); v = v * v;
  hsv(hue, 1-((v > 0.8)/12), v);
}