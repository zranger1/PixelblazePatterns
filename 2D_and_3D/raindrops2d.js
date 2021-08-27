/* Raindrops Falling on a Pool

 Requires a 2D LED array and appropriate pixel mapper.
 This is designed for a 16x16 pixel array, and while it
 scales very well in terms of frame rate, it may run out of
 memory if used on anything with more than about 600
 total pixels (on a PB2).   

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 04/09/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;

// Global variables for rendering
var buffer1 = array(height);  // main drawing surface
var buffer2 = array(height);  // secondary drawing surface
var bgImage = array(height);  // static "sea floor" image.
var pb1, pb2;                 // buffer pointers for swapping
var speed = 765;              // max interval in milliseconds between drops
var nextDrop = speed;         // milliseconds to next drop (random)
var damping = 0.85;           // how quickly waves die down  
var frameTimer = 9999;        // accumulator for simulation timer
var dropTimer = 9999;         // accumulator for raindrop timer

// UI
export function sliderRaindrops(v) {
  speed = 150+1400*(1-v);
}

// create 2 x 2D buffers for calculation, and one
// to hold our background image.
function allocateFrameBuffers() {
  for (var i = 0; i < height; i ++) {
    buffer1[i] = array(width);
    buffer2[i] = array(width);
    bgImage[i] = array(width);
  }
  pb1 = buffer1;
  pb2 = buffer2;
}

// generate a plausible pseudo-random underwater background.  Slowish, but only
// has to be done during initialization. (This is the usual hand-tuned 
// sum-of-sine-waves texture)
function initBackground() {
  var m1 = random(8)-4;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var x1 = x / width; var y1 = y / height;
      var dx = x - 0.5;  var dy = y - 0.5;      
      var val = (wave(x1+y1) + wave(y1 * m1) + 
        wave(sqrt(x1*x1+y1*y1)) + wave(sqrt(dx*dx+dy*dy))) / 4;
      bgImage[x][y] = 0.667 + (0.4*(val-0.8));
    }
  }  
}

function swapBuffers()  {
  var tmp = pb1; pb1 = pb2; pb2 = tmp;
}

// No waves! No physics! We're just repeatedly applying a specialized
// weighted "blur" filter which spreads the initial "raindrop" out
// in a roughly circular fashion and attenuates it over time. 
function doRipples() {
  swapBuffers();    

  // we avoid having to clip or wrap our filter calculation by leaving a
  // one pixel bounding region around the whole display. 
  for (var y = 1; y < height-1; y++) {
    for (var x = 1; x < width-1; x++) {
      var val = ((pb1[x-1][y] + pb1[x+1][y] + pb1[x][y-1] + pb1[x][y+1]) / 4) - pb2[x][y];
      pb2[x][y] = (val * damping);
    }
  }
}

// Initialization
allocateFrameBuffers();
initBackground();

export function beforeRender(delta) {
  frameTimer += delta;
  dropTimer += delta;

  // raindrop timer is random, with upper bound set by the
  // speed slider
  if (dropTimer > nextDrop) {
     var rx = 1+floor(random(width-2));
     var ry = 1+floor(random(height-2));
     pb1[rx][ry] = 1;
    
    nextDrop = random(speed);
    dropTimer = 0;
  }  
  
  // drop calculations are limited to 33/sec because it
  // looks about right...
  if (frameTimer > 33) {
    doRipples();  
    frameTimer = 0;
  }
}

export function render2D(index, x, y) {
  // convert x and y to array indices
  x = floor(x * width);  
  y = floor(y * height);
  // get wave height value (which we will use for brightness) from
  // calculation buffer and gamma correct it
  bri = 0.3+pb2[x][y]; bri = bri * bri;
  // render background image using calculated brigtness,
  // with slight desaturation at wave peaks
  hsv(bgImage[x][y], 1.3-bri,bri);
}