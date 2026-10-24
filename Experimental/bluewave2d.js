// Boxplosion 2D - An explosion of brightly colored boxes!
//
// MIT License
// Take this code and use it to make cool things!
//
// 7/29/2021 - ZRanger1 
// 10/23/2026 - minor fixes
//
export function beforeRender(delta) {
  t1 = time(.3) * 30;  
  t = t1 * 1.05;  
}

var x1,y1,s,temp;
export var r,g,b;
export function render2D(index,x,y) {
  
  x1 = (1-x) + 1.5;
  y1 = 1-y;
  r = g = b = 0;
  for (i = 0; i < 3; i++) {

    y1 += sin(x1*(i*5) + (t + i/5)) * 0.4;
    temp = abs(1/y1/80)
    r += temp*i/1555;
    g += temp*i/155;
    b += temp*i;
  }

  r = min(1,r*r); g = min(1,g*g); b = min(1,b*b);
  rgb(r,g,b);
}