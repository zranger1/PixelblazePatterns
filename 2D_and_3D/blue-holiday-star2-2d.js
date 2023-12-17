// Another twinkling star to light your way!
//
// This one uses a fast, but cranky geometric distance field
// function to draw its star.
// 
// Requires a mapped 2D display.
//
// MIT License
// 12/14/2023 ZRanger1

// global variables
var speed = 1000;
var timebase = 0;
var twinkle;

// UI
export function sliderSpeed(v) {
  speed = 2000 * max(0.005,(1-v));
}

export function beforeRender(delta) {
  timebase = (timebase + delta/speed) % 3600;
  
  resetTransform();
  translate(-0.5,-0.5); 
  scale(2,2)

  // slow rotation just makes it look better
  rotate((timebase / 10) % PI)

  // vary ray sizes for animated twinkle
  twinkle =  1 - 0.125 * wave(timebase) 
}

// Draw mirrored diagonal rays with a little fill
// in the center.  (Actually modified triangles
// expanding outward from center.)
// 
// Experimenters, note that this function
// is super sensitive to tuning. 
// Changing the constants produces all kinds of
// interesting, sometimes messy images
function swiftstar(x,y, anim) {
    x = abs(x); y = abs(y);
    xpos = min(x/y,anim);
    ypos = min(y/x,anim);

    p = (2. - xpos - ypos);
    return (.75+p*(p*p-1.25)) / (x+y);      
}

export function render2D(index,x,y) {
  b = clamp(swiftstar(x,y,twinkle),0,1)
  b = b * b * b * b;

  // draw star in cyan/blue w/some desaturation towards the middle
  hsv(0.56,1.75-b,b);
}