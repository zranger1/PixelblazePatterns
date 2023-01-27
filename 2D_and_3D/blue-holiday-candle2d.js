// Candle flame using distorted circles
// Yet another way to make fire! 
//
// MIT License
// 1/25/2023 ZRanger1


var numTwinklers = 3
var twinkleSpeed = 0.01
export var tIndex = array(numTwinklers);
export var tPos = 0;
export var twinklers = array(numTwinklers);
var twinkleState = array(numTwinklers);
var twinkleIncrement = array(numTwinklers);
var timebase;

// move coordinate origin to 0 and flip y axis so we can
// put the candle at the bottom (comment out the scale() statement if
// you don't need it for your display.
translate(-0.5,-0.5);
scale(1,-1);

function sortIndex(v1, v2) {
  return (twinklers[v1] < twinklers[v2]) ? -1 : 0;
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  // generate 3 octave sine wave pattern for flame movement
  t1 = -0.875+(wave(time(0.06)) + wave(time(0.03))/2 + wave(time(0.015))/4); 
  
  // timer for blue flame's internal flicker
  t2 = timebase * 2;
  
  // twinkling white stars in background
  for (i = 0; i < numTwinklers;i++) {
     if (twinkleState[i] <= 0) {
       twinklers[i] = floor(random(pixelCount));
       twinkleIncrement[i] = 0.0075+twinkleSpeed * random(1);
       twinkleState[i] = 1;

     }
     else {
       twinkleState[i] -= twinkleIncrement[i];
     }
     tIndex[i] = i;                
  }
  
  arraySortBy(tIndex, sortIndex);
  ak = tPos
  tPos = 0;
}

export function render2D(index,x,y) {

  // calculate position and width of candle at base of flame
  f = max(0,(-(abs(x) - 0.425)) * (y < -0.4));  

  // adjust aspect ratio to make flame taller and less round
  x *= 1.75;
  
  // calculate x displacement value for this y coord
  x += (-0.5+wave(6*y * t1)) * (y+0.5) * 0.175;
  
  // inner (blue) circle
  d = (hypot(x,y)-0.1)+(y/3);
  s = 1-clamp(d/0.15,0,1);
  s += s * (-0.5+0.5*triangle(t2+x*5+y*11))

  // outer (orange) circle
  d = abs(hypot(x,y)-0.33);
  h = 1-smoothstep(0,0.15,d);

  // build the flame + candle color
  // edge is red with a tiny amount of green added to make yellow at bottom
  // center and candle are blue
  r = s * 0.2 + h * 0.9;
  g = s * 0.3 + (h * 0.4*(1-2*y));
  b = s + f
  
  // if this pixel is part of the flame, use the calculated flame color
  if ((r+g+b) > 0.05) {
    rgb(r,g,b);
  } 
  else {
    // if it's a twinkling "star" in the on state, light it up!
    if (tPos < numTwinklers && index == twinklers[tIndex[tPos]]) {
      hsv(0.025,0.15,0.75*wave(-.25+twinkleState[tIndex[tPos]]))
      tPos++;
      return;
    }  
    // otherwise, use the background color - dark purple
    hsv(0.75,1,0.02)
  }
}