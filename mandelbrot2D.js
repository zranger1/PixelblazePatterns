/*
 Mandelbrot Set 2D - brute force version!
 
 Displays and animates a view of the Mandelbrot set -- the set
 of points for which the series (z[n+1] = z[n]^2 + C) remains within
 a bounded region (at least during our relatively small number of
 iterations) rather than heading for infinity. 
 
 Requires a 2D LED array and appropriate pixel mapper.

 This is *very* compute intensive, so be careful with the interaction between
 maxIterations and display size.  Somewhere around maxIterations=15 or 16 looks
 good on a 16x16 matrix.  Reduce iterations for higher frame rate or for larger
 displays.  Too many iterations may cause your Pixelblaze to behave 
 erratically or become unresponsive.
 
 Reference:
 https://mathworld.wolfram.com/MandelbrotSet.html
 
 Version  Author        Date        
 1.0.0    JEM(ZRanger1) 12/08/2020  
*/ 

// how many roads must a man walk down, before he runs out of execution steps...
// the answer my friend, is about 17 on a Pixelblaze 2 driving a 16x16 matrix.
export var maxIterations = 15

// complex number describing the region of the set we're viewing. There is 
// a relationship between number of iterations and how much of the set is visible.
// If you reduce iterations and don't see much, try changing these constants a bit.
var cR = -0.94299  
var cI = 0.3162

// various variables for holding calculation results. Up here so they
// can be easily exported for debugging if necessary
var cX,cY;
var fX,fY;

// timers used to animate movement and color
var t1,t2

//UI

// range of maxIterations is 5 to 17.  You can go higher if you want, but
// be a bit careful.
export function sliderIterations(v) {
  maxIterations = 5+floor(v * 12)  
}

// The viewed portion of set moves w/timer t1. Timers and constants are hand-tuned, so
// feel free to experiment to see different areas of the set.  
export function beforeRender(delta) {
  t1 = (triangle(time(0.2)) - 0.5) * 2.4;   
  t2 = time(0.05);

  cX = cR + t1;       
  cY = cI + (t1 / 2.5)
}

// In Render2D, we iterate over every pixel until the value at that point heads
// for infinity (er, 4 in our case) or we hit the maximum number of iterations.
// x/y pixel coords are mapped to -0.5 to 0.5 to keep everything in 16.16 range.
// The mapper's coordinate normalizing mechanic really helps out here.
export function render2D(index,x,y) {
  x = x - 0.5; y = y - 0.5;    // scale coords to range -0.5 to 0.5
  
// iterate fn over the pixel 'til we hit maxIterations or the value goes
// out of range.
  for (var iter = 0; iter < maxIterations; iter++) {
    x2 = x * x; y2 = y * y;
    if ((x2 + y2) > 4) break;  // 4 is our stand-in for infinity!

    var fX = x2 - y2 + cX;
    var fY = 2 * x * y + cY;
    x = fX; y = fY;
  }
// once we're out of the loop, color by how quickly the function tended towards infinity
// quicker exits give lower hue values, a point that didn't ever break out is displayed 
// as black.  More iterations would give more detail, but we run out of CPU pretty quickly here
//
  (iter < maxIterations) ? hsv(t2+(iter/maxIterations),1,1) : rgb(0,0,0);  // weird, but just a hair faster... 
}