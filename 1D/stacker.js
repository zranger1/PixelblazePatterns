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

// initial values for colors
// h1 is the "stacked" color, h2 the "traveling" color
var h1 = 0.3333, s1 = 1,v1 = 1;
var h2 = 0.9, s2 = 1, v2 = 1;

var divisions = 3;    // number of segments
var count;            // pixels per segment
var center;           // index (offset) of segment's center
var pos;              // current pixel position
var counter;          // count of pixels currently "stacked" in a segment
var t1;               // color animation timer

// Color mode support - various ways of coloring our traveling and stacked pixels.
// Really just an array of pointers to very short expressions that set the colors.
// Each expression takes the current pixel index as a parameter and returns a 
// hue value that can be plugged directly into hsv()
//
// By default, start in "rainbow" mode, with 3 segments.
var colorMode = 1;    
var nColorModes = 3;
var colorModes = array(nColorModes);
colorModes[0] =  (f) => h1;           
colorModes[1] =  (f) => h1+t1+f/center
colorModes[2] =  (f) => .618 * round(f / size);

// "pixel" block size information
export var size = 4;
var halfSize = size / 2;

// speed control.  How many milliseconds do we wait between
// pixel movements?
var frameTime;
var msPerFrame = 10

/*
// Slider UI
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
  colorMode = clamp(v * nColorModes,0,nColorModes-1);
}


*/
// Precalculate variables to reflect current segment
// count setting.  Called when pattern starts, and 
// when the user changes segment size.
function initSegments() {
  count = floor(pixelCount / divisions)
  center = floor(count / 2);  
  pos = 0;
  counter = 0;  
}

initSegments();

export function beforeRender(delta) {
  frameTime += delta; // pixel movement timer
  t1 = time(0.03);    // color animation timer.
  
  // at frame movement time, calculate the current position of
  // our moving block within a segment. If it's reached the 
  // current "stack", reset it to the outside edges.
  //
  // This calculation only needs to be done for one segment since
  // all the segments are the same size.  We use modulo arithmetic 
  // in render() to draw as many duplicates as we need.
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
  index = index % count;            // subdivide strip into "blocks" of user specified size
  index = center-abs(index-center); // where is the current pixel in the current segment?
  
  // if the pixel has reached the "stacked" region, color it accoring to color mode
  // (by calling the user-selected coloring function from our array of pointers.)
  if (index > (center - counter)) {
    hsv(colorModes[colorMode](index),s1,v1);
  }
  // if it's in our traveling block, use the user's "travelling" color
  else if (abs(index - pos) < halfSize) {
    hsv(h2,s2,v2);
  }
  // otherwise, it's not (yet) part of one of our colored regions, turn it off.
  else {
    rgb(0,0,0);
  }
}