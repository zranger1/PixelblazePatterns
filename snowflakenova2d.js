var cellScale = 3;  // sqrt of number of displayable cells


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
  return frac(abs(xs / 100));
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
        rollSeed(xOffs + tileX); pX = roll();
        rollSeed(yOffs + tileY); pY = roll();        

			// Animate the point
			  pX = triangle(t1 + pX);
			  pY = triangle(t1 + pY);			  

			// Vector between the pixel and the point
			  diffX = (xOffs + pX) - posX;
			  diffY = (yOffs + pY) - posY;			  
			  var dist = hypot(diffX,diffY);
			  
			  minDist = min(minDist,dist*minDist);
      }
    }

    // Draw the min distance (distance field)
    v = (minDist < 0.12) ? minDist: 0;
    hsv(0.6667,.7, v)    
}
