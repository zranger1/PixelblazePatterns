// LINER v0.1
// 9/02/21 ZRanger1

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
  
  tmp = r + g + b;
  r = clamp(r * tmp,0,1);
  g = clamp(g * tmp,0,1);
  b = clamp(b * tmp,0,1);
  
  rgb(r*r,g*g,b*b);
}