/*
 perlin fire wind tunnel - a spiraling tunnel of wind-blown flame.
 
 Based heavily on @wizard's "perlin fire wind" pattern
 6/2024 - ZRanger1
*/

modes = [
  (x,y,z) => (2 * abs(perlin(x, y, z, 0))),
  (x,y,z) => abs(perlinRidge(x, y, z, 1.75, .75, 1, 3)),
  (x,y,z) => abs(perlinFbm(x, y, z, 1.5, 1, 3)),
  (x,y,z) => abs(perlinTurbulence(x, y, z, 1.65, .78, 3)),
]
var mode = 1
export var density = 1
var speed = 5
export var wind = 0.25
var hue = 0

export function sliderHue(v) {
   hue = v;
}

export function sliderMode(v) {
  mode = floor(v*(modes.length-1))
}
export function showNumberMode() {
  return mode
}
export function sliderdensity(v) {
  density = 0.25 + v*3
}

export function sliderWind(v) {
  wind = v
}

export function sliderSpeed(v) {
  speed = 8 - v*8
}

export function beforeRender(delta) {
  t1 = time(.1)
  t2 = time(.07)
  t3 = time(.133)
  //perlin wraps smoothly every 256, so 0.0 and 256 are the same
  //animate the perlin noise by moving z across time from 0-256
  //this also means increasing the interval we use with time()
  //and happens to give us over 7.6 minutes of unique noise
  noiseTime = time(8) * 256
  noiseYTime = time(1 + speed) * 256
  modeFn = modes[mode]
  
  resetTransform()
  
  translate(-0.5, -0.5)
  scale(density,density)
}
export function render2D(index, x, y) {
  // add wind "wobble" to the x coordinate before we do anything else to
  // the coordinate system.
  var wobble = wind * sin(((y-.5)/density + t2 + wave(t3)) * PI2) * .15 * (density-y)
  x += wobble  

  // make a simple tunnel effect by rotating every pixel a little according to how far it is
  // from the center.  You can make a tunnel out of anything this way!
  theta = (t1 * PI2) + density/hypot(x,y)

  // and rotate the pixel coordinates
  var cosT = cos(theta);
  var sinT = sin(theta);  
  var x1 = x; var y1 = y;
  
  x = (cosT * x1) - (sinT * y1);
  y = (sinT * x1) + (cosT * y1);  
  
  // generate the flames  
  v = modeFn(x,y/2 + noiseYTime,noiseTime )
  v = clamp(v,0,1)
  
  // compute flame colors. 
  hsv(hue+0.1 * v,1.75-v,v*v*v)
}