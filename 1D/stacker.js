/*
It's... 1D Tetris! Sort of.  
Subdivide the strip into 1 to 6 segments of equal length, then fill each segment 
with color from the edges to the center.  There are several color modes described below,
and sliders animation speed and fill "block" size.

colorMode 0: User selected solid color
colorMode 1: Animated Rainbow
colorMode 2: Color Bands

MIT License
8/26/2021 ZRanger1
*/

var h1 = 0.3333, s1 = 1,v1 = 1;
var h2 = 0.9, s2 = 1, v2 = 1;

var divisions = 2;
var count;
var center;
var pos;
var counter;

var colorMode = 0;
var nColorModes = 3;
var colorModes = array(nColorModes);
colorModes[0] =  (f) => h1;
colorModes[1] =  (f) => h1+t1+f/center
colorModes[2] =  (f) => .618 * floor(f / size);


export var size = 4;
var halfSize = size / 2;

var frameTime;
var msPerFrame = 10

export function hsvPickerColor1(h,s,v) {
  h1 = h; s1 = s; v1 = v;
}

export function hsvPickerColor2(h,s,v) {
  h2 = h; s2 = s; v2 = v;
}

export function sliderSpeed(v) {
  msPerFrame = 250 * (1-v);
}

export function sliderSize(v) {
  size = 1+floor(10*v);
  halfSize = size / 2;
}

export function sliderSegments(v) {
  var n = 1+floor(v*5);
  if (divisions != n) {
    divisions = n;
    initSegments();
  }
}

export function sliderColorMode(v) {
  colorMode = floor(v * (nColorModes-1))
}

function initSegments() {
  count = floor(pixelCount / divisions)
  center = floor(count / 2);  
  pos = 0;
  counter = 0;  
}

initSegments();

var t1;
export function beforeRender(delta) {
  frameTime += delta;
  t1 = time(0.03);
  
  if (frameTime >= msPerFrame) {
    pos++;
    if (pos > (center-counter)) {
      counter+=size
      if (counter >= center) counter = 0;
      pos = 0;
    }
    frameTime = 0
  }
}

export function render(index) {
  index = index % count;
  index = center-abs(index-center);
  
  if (index > (center - counter)) {
//    var c = (colorMode) ? t1 + (index/center) : 0;
    hsv(colorModes[colorMode](index),s1,v1);
  }
  else if (abs(index - pos) < halfSize) {
    hsv(h2,s2,v2);
  }
  else {
    rgb(0,0,0);
  }
}