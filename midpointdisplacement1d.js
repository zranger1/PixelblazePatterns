// Midpoint Displacement 1D
// Recursive midpoint displacement to generate a "natural looking" 1D 
// fractal height map.
//  
// Version 1.0.0 JEM(ZRanger1) 07/10/2020 

// Various variables
var  heightMap = array(pixelCount);
var  maxDisplacement = 10;        // maximum height change at level 1

// Initial parameters chosen by eyeball.  Many interesting things are
// possible, so please play with the sliders! Palette width and offset
// are good places to start. The relevant variables
// are exported so you can watch them in your browser.
export var speed = 0.03;          // 0.015 = 1 palette cycle / second
export var roughness = 1.4;       // change in max displacement per level
export var paletteWidth = 0.15;   
export var paletteOffset = 0;     
export var mapLifetime = 5000;    // in milliseconds, 0 == forever. 
export var maxLevel = calcMaxRecursionDepth();

// working globals for animation
var  t1;
var  xOffset;
var  mapTimer = 0;

// max is power of 2 nearest to, but less than pixelCount. 
// absolute max is 7 -- above that, none of my Pixelblazes
// will go.  
function calcMaxRecursionDepth() {
  return min(7, floor(log2(pixelCount)))
}


// UI
export function sliderMaxLevel(v) {
  maxLevel = floor(calcMaxRecursionDepth() * v);
}

export function slidermapLifetime(v) {
  mapLifetime = floor(30000 * v);
}

export function sliderSpeed(v) {
  speed = 0.1 * (1-v);
}

export function sliderPaletteWidth(v) {
  paletteWidth = v;
}

export function sliderPaletteOffset(v) {
  paletteOffset = v;
}

export function sliderRoughness(v) {
  roughness = 0.3 + (2.7 * v);
}

// calculate random offset proportionate to current level
function displace(level) {
   var d = (2 * maxDisplacement) / pow(roughness,level);
   return d - random(2 * d);
}

// displace initial segment endpoints and draw a smooth line
// between them
function initialize() {
  heightMap[0] = displace(1);
  heightMap[pixelCount - 1] = displace(1);
  interpolate(0,pixelCount);
}

// rescale height map to range 0-1
function normalize() {
  var i,hMax,hMin,range;
  
  hMax = -32000;
  hMin = 32000;
  
  for (i = 0; i < pixelCount; i++) {
    if (heightMap[i] > hMax) { hMax = heightMap[i]; }
    if (heightMap[i] < hMin) { hMin = heightMap[i]; }       
  }
  range = hMax - hMin;
  
  for (i = 0; i < pixelCount; i++) {
    heightMap[i] = (heightMap[i] - hMin) / range;
  }
}

// line between segment endpoints
function interpolate(start, nPix) {
  var m = (heightMap[start + nPix - 1] - heightMap[start]) / nPix;
  
  for (c = 1; c < nPix; c++ ) {
    heightMap[c+start] = heightMap[start] + (m * c);
  }
}

// given segment, find and displace midpoint, then subdivide
// and repeat for each new segment
function subdivide(indexStart,nPix,level) {
    var i, newLen, indexMid;
          
// if we can't subdivide further, we're done 
    if (level > maxLevel) { return; }

// find midpoint and add random height displacement
    newLen = floor(nPix / 2);
    indexMid = indexStart + newLen - 1;
    heightMap[indexMid] += displace(level)
    
    interpolate(indexStart, newLen);
    interpolate(indexMid,1 + nPix - newLen);

// recursion! Do the same thing with our two new line segments    
    level += 1;
    subdivide(indexStart, newLen, level);
    subdivide(indexMid, 1 + nPix - newLen, level);   
}

// create initial heightmap
initialize()
subdivide(0,pixelCount , 1);
normalize();   

// beforeRender
export function beforeRender(delta) {
   mapTimer += delta;

   t1 = time(speed);

// generate new height map every <mapLifetime> milliseconds 
// setting mapLifetime to 0 == forever
   if (mapLifetime && (mapTimer > mapLifetime)) {
     mapTimer = 0;

     initialize();
     subdivide(0,pixelCount, 1); 
     normalize();        
   }
}

// render heightmap and do something inexpensive to animate 
export function render(index) {	
  var h = (heightMap[index] + t1) % 1;
  h = paletteOffset + (h * paletteWidth);
  hsv(h,1,heightMap[index]);  
}
