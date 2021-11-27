// Worley cell noise generator 
// CAREFUL - very CPU intensive.
// Worley noise is widely used on high resolution displays to generate
// voronoi-like distance fields while limiting the number of per-pixel
// comparisons.
//
// On LED displays though, the number of pixels is so small that it's 
// actually faster to just calculate the normal voronoi distance.
//
// I'm still looking ways to make this faster and more useful though!
// 7/4/2021 ZRanger1

var cellScale = 2;  // sqrt of number of displayable cells


export var tileX,tileY,posX,posY
export var pX,pY;
var diffX,diffY;
export var minDist;

scale(cellScale,cellScale);

export function beforeRender(delta) {
  t1 = time(0.1);
}


// 16 bit xorshift PRNG from 
// http://www.retroprogramming.com/2017/07/xorshift-pseudorandom-numbers-in-z80.html
// returns a pseudorandom value between 0 and 1
var xs;
function roll() {
  xs ^= xs << 7
  xs ^= xs >> 9
  xs ^= xs << 8
  return frac(abs(xs/100));
}

function rollSeed(seed) {
  xs = seed;
}

export function render2D(index,x,y) {

    tileX = floor(x); tileY = floor(y);
    posX = frac(x); posY = frac(y);

    minDist = 1;

    for (var yOffs = -1; yOffs <= 1; yOffs++) {
      for (var xOffs = -1; xOffs <= 1; xOffs++) {

        // Random position from current + neighbor place in the grid
        xs = (xOffs + tileX); pX = roll();
        xs = (yOffs + tileY); pY = roll();        

			// Animate the point
			  pX = triangle(t1 + pX) * 0.7;
			  pY = triangle(-0.25+t1 + pY) * 0.7;			  

			// Vector between the pixel and the point
			  diffX = (xOffs + pX) - posX;
			  diffY = (yOffs + pY) - posY;			  
			  var dist = hypot(diffX,diffY);
			  
			  minDist = min(minDist,dist);
      }
    }

    // Draw the min distance (distance field)
    v = wave(4*minDist);
    hsv(minDist,1, v)    
}
