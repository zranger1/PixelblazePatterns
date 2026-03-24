// Rainstorm + lightning
// Requires a mapped 2D display.
//
// MIT License
// Take this code and use it to make cool things!
//
// 3/23/2026 ZRanger1


var timebase = 0
var theta = 0.4
var speed = 1.0/1000
var flash = 0
export var streakWidth = 8
export var flashGate = 5

export function sliderSpeed(v) {
  speed = mix(0.2,1.5,v) / 1000
}

export function sliderAngle(v) {
  theta = PI2 * v
}

export function sliderScale(v) {
 streakWidth = mix(3,11,1 - v) 
}

export function sliderLightning(v) {
  flashGate = PI2 * (1 - v)
}

export function beforeRender(delta) {
  // allows speed control without visual glitching
  timebase = (timebase + delta * speed) % 3600
  t1 = timebase * 10;

  // use perlin noise to generate randomized periodic lightning flashes
  flash = clamp(2 * perlin(timebase * 8,timebase / 2,PI,PI2),0,1)
  flash = flash * flash * flash * (timebase % PI2 > flashGate)
  
  resetTransform()
  translate(-0.5,-0.5)
  scale(2,-2)
  rotate(theta)
}

export function render2D(index,x,y) {
  
 // calculate and save distance from center for lighting radius  
 // flash radius varies w/lightning "strength" (from perlin noise)
 r = 1.414 * flash - hypot(x,y) 
 
 // limit the length of the rain "streaks" by shifting and scaling coords a little
 l = hypot(x,y + 2.1) * .05 + 1.0;
 x *= l; y *= l;
 
 prngSeed(floor(x * streakWidth))
 v = 1-sin(prng(2))
 
 z = 5/(4 + v)
 b = clamp(abs(sin(t1 * v + y * z)),0,1)
 c = v * b
  
  h = 0.6667
  c = c * c * c * c
  hsv(h, (1 - flash)-c/20, c + (flash * r * r * r))
}