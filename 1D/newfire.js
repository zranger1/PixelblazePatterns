// Newfire - Doomfire in 1D! 
// Controllable, multicolored, realistic fire for
// strips, strands and strings.  
//
// (Note that the saturation you choose with the color picker
// controls the amount of "white heat" at the base of the 
// fire.)
//
// MIT License
// Take this code and make cool things
// 12/19/23 ZRanger1
  
export var cooling = 0.065
export var variability = 0.1
export var mode = 0;
var midpoint = floor(pixelCount / 2)
export var msPerFrame = 40 
var timebase = 0;
frameTimer = 0 
hue = 0;
sat = 1.75;
bri = 1;

// the heat array stores the current "temperature" of each pixel
var heat = array(pixelCount+1) 

// heat[0] is our heat source. It drives the whole
// simulation.We set it to 1, which is the hottest
// possible value. 
heat[0] = 1;

// short functions to map from heat array to actual pixels
// this lets us display the flame in several different ways,
// borrowed from the library "Sparkfire" pattern
// 0 - single flame from bottom to top (normal)
// 1 - single flame from top to bottom
// 2 - two flames radiating out from center
// 3 - two flames radiating in from ends
var mapModes = [
  (f) => f,  
  (f) => (pixelCount - f + 1),  
  (f) => 2 * (f < midpoint) ? abs(midpoint - f)  : f - midpoint,
  (f) => 2 * (f < midpoint) ? f : pixelCount - f + 1
]

// UI

// color - Hue and Brightness work as expected,
// saturation controls the amount of "white heat"
// allowed.
export function hsvPickerColor(h,s,v) {
  hue = h;
  sat = 1.9 * s;
  bri = v;
}

export function sliderFlameHeight(v) {
  cooling = mix(0.025,0.45,1 - v)
}

export function sliderHeat(v) {
  heat[0] = mix(0.4,1,v);
}

export function sliderSparks(v) {
  variability = v / 2;
}

export function sliderMode(v) {
  mode = floor(0.5 + 3 * v)
}
 
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600
  // control the simulation rate so the fire moves at
  // a more-or-less realistic speed. This is independent
  // of the actual LED frame rate, which will likely be
  // much higher.
   frameTimer += delta
  if ( frameTimer < msPerFrame) return;
  
  frameTimer = 0;
  
  // updated to use a slow-moving perlin noise to vary the flame movement speed.
  // This is better -- it makes the fire much less regular, and more realistic
  msPerFrame =  max(33, 25 + 50 *  (0.5 + 0.5 * perlin(timebase * 2, 0.333, 0.666, PI)))

  // move heat up the flame column. Instead of 2D DoomFire's
  // regular convolution kernel + wind, we sample hotter pixels
  // below us at slightly randomized distances.  This
  // gives us a less predictable fire than simply looking
  // at the pixel below the current one.
  for (i = pixelCount; i >= 1; i--) {
     r = random(cooling);
     k = max(0,i - (1 + random(1)))
     heat[i] = max(0,heat[k] - r)
  }

  // borrowed and extended the spark concept from the
  // Sparkfire library pattern
  // This one can make dark spots as well as sparks, for
  // a more interesting look.  Turn up sparks
  // and you get a sputtering burner effect.
  if (random(1) <= variability) {
    i = ceil(random(pixelCount / 8))
    heat[i] = min(heat[i] + (random(2)-0.5),max(0.575,heat[0])) 
  }
}  

export function render(index) {
  // map temperature to display pixel, gamma correct and display  
  k = heat[mapModes[mode](index + 1)]
  k = k * k * k;
  hsv(hue + (0.1 * k),sat-k,bri * k)
} 
