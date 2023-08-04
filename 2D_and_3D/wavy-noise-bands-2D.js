// Wavy Bands
//
// Requires a correctly configured 2D map
//
// MIT License - use this code to make more cool things!
//
// 6/22/2023 ZRanger1

// number of displayed columns. Could easily have a UI control
export var nColumns = 4

timebase = 0;
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600
  
  tx = -timebase / 4    // speed of x axis movement
  ty = timebase / 2    // speed of y axis movement
}

export function render2D(index,x,y) {
  // distort y coord with perlin noise to vary width of individual columns
  // (constant multipliers are hand-tuned)
  y -= 0.3 * perlin(x * 2, y * 2, ty, 1.618) 
  
  // distort x coord to create wave patterns
  x += 0.1752 * sin(4 * (tx + y))
  
  // quantize color into the specified number of column bins
  h = floor(x * nColumns)
  
  // the original shader colors column edges black. Here, we darken
  // and antialias them, which looks better at low resolution
  v = (x * nColumns - 0.5)
  v =  1-(2*abs(v - h));

  // calculate the final column color, adjust brightness
  // gradient bit and display the pixel
  hsv(h / nColumns, 0.9, pow(v,1.25))
}