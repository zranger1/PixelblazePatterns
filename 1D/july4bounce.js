// Red, and blue bouncing pattern, with illusory white
// created by the eye averaging at high frame rate.
// *** CAUTION: This is super cool if your strip is running  
// around 120 fps or above.  It's a chaotic, blinking
// mess otherwise.
//
// Version 1.0.0 JEM(ZRanger1) 07/20/2020 

var bgHue = 0;
var wipeHue = 0;
var index2 = 0;
var indexLast = 0;

export function beforeRender(delta) {
  index2 = floor(time(0.015) * pixelCount);
  
  if (index2 < indexLast) {
    bgHue = wipeHue;
    wipeHue = time(0.05);
  }
  indexLast = index2;
}

export function render(index) {
  var h = (index <= index2) ? wipeHue : bgHue;
  hsv(h, 1, 1)
}

var t1;
var hue = 0;
var sign = 0;
var delay = 0;

export function beforeRender(delta) {
  t1 = time(0.02);

  if (sign = ~sign) {
    t1 = 1-t1;
    hue = 0.6
  }
  else {
    hue = 0
  }
  t1 = pixelCount * t1;
}

export function render(index) {
  var x = index - t1;
  x = (x * x) / (pixelCount * 5);
  hsv(hue, 1, 1-x)
}