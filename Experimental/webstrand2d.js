// Falling webs, strands and occasional legs...
// There must be spiders in here somewhere
// For 2D displays.
// 9/10/2021 ZRanger1

var timebase

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
}

translate(-0.5,-0.5)
scale(0.2,0.2);

export function render2D(index,x,y) {
  vColor = 0;
  
  for (var i = 0; i < 3; i++) {
    t = timebase * (i * 0.1 + 1)/3 + (i * 0.1+0.1);
    
    y += sin(-t+x * 2) * 0.45 - t * 0.3;
    x += sin(-t+y*5) * -.25;
    v = sin(y * 5) + sin(x * 4 + t * 0.3);
    
    vColor += (1/sqrt(abs(v))) * 0.1;
  }
  
  tmp = vColor;
  r = tmp*max(0.1,abs(sin(timebase*0.1))) ; 
  g = max(0.1,tmp * abs(sin(timebase*0.03 + 1)));
  b = max(0.1,tmp * abs(sin(timebase*0.02 + 3)));
  
  // brighten the heck out of everything, 'till it
  // looks like it's glowing, then gamma adjust a bit
  tmp = r + g + b;
  r = clamp(r * tmp,0,1); r = max(0.05,r*r);
  g = clamp(g * tmp,0,1); g = max(0.05,g*g);
  b = clamp(b * tmp,0,1); b = max(0.05,b*b);
  
  rgb(r,g,b);
}