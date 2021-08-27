// random color wipe
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