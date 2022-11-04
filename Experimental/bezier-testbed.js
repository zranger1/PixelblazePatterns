// Bezier Testbed -- Animated "Leaping" curve
// requires Pixelblaze 3 w/3.30 or higher firmware
//
// 11/2022 ZRanger1

export function beforeRender(delta) {
  t1 = time(0.04);
  c1 = wave(t1);
  c4 = wave(-0.25-t1);
  
  t2 = time(0.01)
  c2 = wave(t2)
  c3 = wave(-0.25-t2)  
}

export function render2D(index,x,y) {
  d = bezierCubic(x,c1,c2,c3,c4);
  v = 1-min(1,(abs(y-d)/ 0.165));
  
  hsv(t1+d, 1, v*v*v)
}