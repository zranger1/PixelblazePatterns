// Candle flame using distorted circles
// This version tuned for Lux Lavalier
//
// Yet another way to make fire! 
//
// MIT License
// 12/22/2022 ZRanger1

var t1,t2;

// move coordinate origin to 0 
translate(-0.5,-0.5);

export function beforeRender(delta) {
  // generate sketchy 3 octave sine wave noise for flame movement
  t1 = -0.875+(wave(time(0.06)) + wave(time(0.03))*0.5 + wave(time(0.015))*0.25);
  t2 = triangle(time(0.3));
}

export function render2D(index,x,y) {
  // calculate position and width of candle at base of flame, and
  // very dim blue background
  f = (y < -0.375) + 0.06

  // adjust aspect ratio to make flame taller and less round
  x *= 1.75
  
  // calculate x displacement value for this y coord
  var s1 = (-0.5+wave(6*y * t1)) * (y+0.5) * 0.3;

  // inner (blue) circle
  d = abs(hypot(x+s1,y)-0.1)
  s = 1-smoothstep(0,0.2,d);  

  // outer (orange) circle
  d = abs(hypot(x+s1,y)-0.325)
  h = 1-smoothstep(0,0.178,d);
  
  var s2 = -0.1*wave(t2*(s+h))  

  // build the flame + candle color
  // edge is red with a tiny amount of green added to make yellow at bottom
  // center and candle are blue
  r = s * 0.2 + h * 0.9 + s2;
  g = s * 0.35 + (h * 0.2*(1-2*y)) + s2;
  b = s + s2 + f

  rgb(r,g,b);
}