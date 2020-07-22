// flashes a random number of random pixels on a colored background at
// semi-random intervals.  Flash duration (spark hold) and maximum time
// between flashes (Max Delay) are controlled by sliders.
//
// Version 1.0.0 JEM(ZRanger1) 07/20/2020 

var frameTime = 0;
var pix = -1;

var hue = 0.7;
var sat = 0.5;
var bri = 0.2;

export var speed = 250;  
export var hold = 80;   
export var max_delay = 500;

var sparks = array(pixelCount);

export function sliderMaxDelay(v) {
  max_delay = v * 1000;
}

export function sliderSparkHold(v) {
  hold = (v * v) * 250;
}

export function hsvPickerBackgroundColor(h, s, v)
{
  hue = h; sat = s; bri = v;
}

export function beforeRender(delta) {
  frameTime += delta;

  if (pix == -1) {
    if (frameTime > speed) {
      nsparks = random(pixelCount / 3);
      for (var i = 0; i < nsparks;i++) {
        sparks[floor(random(1) * pixelCount)] = 1;
      }  
      frameTime = 0;
      pix = 0;
      speed = random(max_delay);
    }
  }
  else if (frameTime > hold) {
    pix = -1;
    for (var i = 0; i < pixelCount;i++) {
      sparks[i] = 0;
    }  
  }
}

export function render(index) {
  if (sparks[index]) {
      rgb(1,1,1);
      return
  }  
  hsv(hue, sat, bri);
}