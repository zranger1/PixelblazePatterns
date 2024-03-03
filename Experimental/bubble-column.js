// Bubble Column
// Rising bubbles in a slowly swirling fluid,
// designed for well diffused, vertically oriented
// 1D displays.
//
// Short demo video:
// https://www.youtube.com/shorts/FzWQfqL0Eko
// 
// MIT License
// Take this code and use it to make cool things!
// 
// 12/18/23 ZRanger1
var numBubbles = 9
var bubbleSize = 3
var valveOpen = 0.6
var fluidH = 0.64
var fluidB = 0.08

var startVelocity = 10         
var velocityRange = 1.5 * startVelocity;   
var acceleration = 0.02

var velocity = array(numBubbles)
var position = array(numBubbles)
var pixels = array(pixelCount)

var timebase = 0

// start bubbles off the display so they'll
// get injected over time by the normal mechanism.
for (i = 0; i < numBubbles; i++) {
  position[i] = pixelCount + 10
}

// UI 

// base hue of "fluid" in column.
export function hsvPickerFluidHue(h,s,v) {
  fluidH = h 
}

// higher == new bubbles more often
export function sliderBubbleValve(v) {
  valveOpen = 0.8 * (1 - v)
}

function randomSpeed() {
  return startVelocity  + random(velocityRange) - velocityRange / 2
}

export function beforeRender(delta) {
  delta /= 1000;
  timebase = (timebase + delta) % 3600;
  valve = 0.5 + 0.5 * perlin(timebase / 2,timebase,21.76,PI2);
  
  // check each bubble's contribution to each pixel
  for (pixel = 0; pixel < pixelCount; pixel++) {
    pixels[pixel] = 0;
    for (bubble = 0; bubble < numBubbles; bubble++) {
      
      // the line below is (a) a minor optimization, and 
      // (b) adds an "effervescent" effect when bubbles 
      // merge. Comment it out if you want smoother bubbling.
      if (pixels[pixel] > fluidB) break;
      
      dist = 1-min(1,abs(pixel - position[bubble])/bubbleSize) 
      pixels[pixel] += dist * dist * dist * dist
    }
  }

  // move the bubbles
  for (bubble = 0; bubble < numBubbles; bubble++) {
    position[bubble] += velocity[bubble] * delta;
    velocity[bubble] += acceleration;
    
    // let the bubble run slightly off the end of the strip so
    // decay looks right at top of column.
    // When the bubble is no longer visible, set up to 
    // reinject it at the bottom if the "valve" is open.
    // 
    if (position[bubble] > pixelCount) {
      if (valve >= valveOpen) {
        position[bubble] = 0;
        velocity[bubble] = randomSpeed();
      }
    }
  }  
}

export function render(index) {
  a = 0.165*perlin(11*(index/pixelCount - timebase / 10),66.6,33.3,PI2) 
  v = pixels[index]

  if (v <= fluidB) {
    hsv(fluidH + a, 1, fluidB)    
  }
  else {
    hsv(fluidH + a, 0.45 , v)
  }
}
