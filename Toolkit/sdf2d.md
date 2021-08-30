# 2D Signed Distance Functions for Pixelblaze

---

A signed distance function (SDF) is a function that returns the distance between a point and the boundary of the space
described by the function.  The returned distance is positive if the point is outside the shape, zero if exactly on the boundary, and negative if inside the shape. This makes it possible to use SDFs to easily draw filled and unfilled shapes.
 
Below are a set of distance functions for various 2D shapes, adapted for Pixelblaze. Most are ports of OpenGL shader code from

https://iquilezles.org/www/articles/distfunctions/distfunctions.htm

which I highly recommend as a reference and an entry point into a fascinating set of advanced graphics techniques.

If you want to check out one of these functions or test one of your own, here's a simple pattern that 
will let you evaluate a single SDF and render the result.

[SDF Testbed](https://github.com/zranger1/PixelblazePatterns/blob/master/Experimental/SDF%20Testbed2.js)

It comes set up with the n-sided polygon SDF so you can see how it works.  To run your own function, just paste it in and call it in render2D().

## Utility functions
Required by one or more of the signed distance functions and/or generally useful when writing
shader-style patterns.
### Signum
```
// returns the sign of <a> as follows
// -1 if a < 0, 0 if a == 0, 1 if a > 0
function signum(a) {
  return (a > 0) - (a < 0)
}
```

### Dot
```
// dot product for 2D coords
function dot(x1,y1,x2,y2) {
  return (x1 * x2 + y1 * y2);
} 
```

### Dot2
dot product of a 2 element vector w/itself
```
function dot2(x,y) {
  return (x * x + y * y);
}
```

### Mix
Performs linear interpolation between start and end using val to weight between them.
```
function mix(start,end,val) {
  return start * (1-val) + end * val;
}
```
### Smoothstep
Threshold function with a smooth transition.  Interpolates with a sigmoidal
curve 0 and 1 when l < v < h. 
```
function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}
```

---

## Signed Distance functions for Simple Shapes

### Circle
```
function circle(x,y,r) {
  return hypot(x,y) - r;
}
```

### Square
```
function square(x,y,size) {
  dx = abs(x) - size;  d1 = max(dx,0);
  dy = abs(y) - size;  d2 = max(dy,0);
	return min(max(dx, dy), 0.0) + hypot(d1,d2);
}
```

### Rounded Rectangle
The "radius" parameter is the radius of the circle used
to round the corners. If set to 0, corners will be square.
```
function roundedRectangle(x,y,xsize,ysize,radius) {
  dx = abs(x) - xsize + radius;  d1 = max(dx,0);
  dy = abs(y) - ysize + radius;  d2 = max(dy,0);
  
  return min(max(dx, dy), 0.0) + hypot(d1,d2) - radius;  
}
```

### Triangle
```
function triangle(x,y,r) {
	return max((abs(x) * 0.866025) - (y * 0.5), y) - r / 2;
}
```

### Pentagon
```
function pentagon(x,y,r) {
  x = abs(x); 
  rtmp = r * 0.7265;
  
  var dotP = (-0.809 * x + 0.5878 * y) 
  x -= 2*min(dotP,0) * -0.809;
  y -= 2*min(dotP,0) * 0.5857;
  
  var dotP = (0.809 * x + 0.5878 * y)  
  x -= 2*min(dotP,0) * 0.809;
  y -= 2*min(dotP,0) * 0.5857;  
  
  x -= clamp(x,-rtmp,rtmp);
  y -= r;
  return hypot(x,y) * signum(y);
}
```

### Hexagon
Shorter than most hex SDFs -- cheats and takes advantage of
symmetry about both x and y.
```
function hexagon(x,y,r){
     x = abs(x); y = abs(y);
     return  max((x * 0.5 + y * 0.866025),x) - r;
}
```

### Hex Star
```
function hexStar(x,y,r) {
  // rescale to pointy parts of star
  x = abs(x*1.73205); y = abs(y*1.73205); 
  dot = 2 * min(-0.5*x + 0.866025 * y,0);
  x -= dot * -0.5; y -= dot * 0.866025;
  
  dot = 2 * min(0.866025*x + -0.5 * y,0);
  x -= dot * 0.866025; y -= dot * -0.5;
  
  x -= clamp(x, r * 0.57735, r * 1.73205);
  y -= r;
  return signum(y) * hypot(x,y) / 1.73205;
}
```

### Cross
```
// interior distance on this is slightly weird. Still
// looking for a reasonable fix.
function cross(x,y,size,armWidth) {
  x = abs(x); y = abs(y);
  
  if (y > x) { tmp = x; x = y; y = tmp; }
  qx = x - size; qy = y - armWidth;
  k = max(qy,qx);
  if (k > 0) {
    wx = max(qx,0); wy = max(qy,0);
    return hypot(wx,wy);
  } else {
    wx = max(size - x,0); wy = max(-k,0);
    return -hypot(wx,wy);
  }
}
```

### n-Sided Regular Polygon
```
function nSidedPolygon(x,y,r,sides) {
  var x1,y1,bn,he;  
  var an = PI2/sides;
  r -= (sides == 3) * r / 3;
  he = r * tan(0.5*an);

  tmp = -x; x = y; y = tmp;
  var bn = an * floor((atan2(y,x) + 0.5*an)/an);
  c = cos(bn); s = sin(bn);
  x1 = (c * x) + (s * y);
  y1 = (c * y) - (s * x);
  
  return hypot(x1 - r, y1 - clamp(y1,-he,he)) * signum(x1 - r)
}
```

### Moon
```
// parameters are:
//  x,y - point being evaluated
//  radius - radius of outer circle
//  cutoutRadius - radius of cutout to make "moon"
//  cutoutPos - x position of cutout, from -1 to 1. "Phase" of moon.
function moon(x,y,radius,cutoutRadius,cutoutPos) {
  var c2,a,b;
  y = abs(y); x =-x;
  c2 = cutoutPos * cutoutPos;
  a = (radius*radius - cutoutRadius*cutoutRadius + c2) / (2*cutoutPos);
  b = sqrt(max(radius*radius-a*a,0));
  if ((cutoutPos*(x*b-y*a)) > (c2*max(b-y,0.0))) {
    return hypot(x - a,y - b);
  }
  return max(hypot(x,y) - radius,-(hypot(x - cutoutPos, y)-cutoutRadius));
}
```

### Vesica
 A lens shape formed by the intersection of two discs
 https://en.wikipedia.org/wiki/Vesica_piscis
```
// parameters are:
// x,y - point being evaluated
// r - the maximum width of the disc's intersection 
// d - the diameter of the two discs (may be larger than the display)
function vesica(x,y,r,d) {
  x = abs(x); y = abs(y);
  var b = sqrt(r*r-d*d);
  return ((y - b) * d > x * b) ? hypot(x,y-b) : hypot(x-(-d),y) - r;
}
```

### Gear
```
// parameters are:
// x,y - point being evaluated
// r - radius of gear
// tSize - gear tooth size in world coords
// nTeeth - number of gear teeth.
// Makes reasonably functional stars too!
function gear (x,y,r,tSize,nTeeth) {
  return hypot(x,y)/r + tSize * sin(nTeeth*atan2(y,x)) - 1;
}
```

### Diamond
```
function diamond(x,y,r) {
  var tmp;
  x /= 1.414; y /= 1.414;
  tmp = abs(x + y);
  x = abs(x - y);
  y = tmp;
  return max(x,y)/r - 1
}
```

### Line Segment
Evaluates point <x,y> to see if it lies
on the segment defined by <x1,y1><x2,y2>
```
function lineSegment(x,y,x1,y1,x2,y2) {
  ax = x - x1; ay = y - y1;
  bx = x2 - x1; by = y2 - y1;
  h = clamp((ax * bx + ay * by)/(bx * bx + by * by),0,1);
  return hypot(ax - bx * h,ay - by * h);
}
```

### Heart
Draws cardioid shape. Low resolution makes the detail a little
tricky - play with size and line width 'till its the way you like!
```
function heart(x,y,r) {
  var m;
  x = abs(x);
  y = r-y;
  r *= 2;
  if (x+y>r) {
    return (sqrt(dot2(x - r*0.25,y - r*0.75)) - (r*0.3536));
  } else {
    m = 0.5 * max(x + y,0);
    return sqrt(min(dot2(x,y-1),dot2(x-m,y-m)) * signum(x-y));
  }
}
```
---

## Signed Distance functions for Symbols 
  Contributed by Scruffynerf
  
  From https://www.shadertoy.com/view/XsXXDX

### markerT
```
function markerT(x,y,size) {
   size = size*2
   r1 = max(abs(x -size/3. + size/3.), abs(x - size/3. - size/3.));
   r2 = max(abs(y - size/3.), abs(y + size/3.));
   r3 = max(abs(x), abs(y));
   r = max(min(r1,r2),r3);
   r -= size/2.;
   return r;
}
```

### markerCheck
```
function markerCheck(px,py,size){
    x = -SQRT1_2 * (px - py);
    y =  SQRT1_2 * (px + py);
    size = size*2
    r1 = max(abs(x - 2.*size/3.), abs(x - 1.*size/3.));
    r2 = max(abs(y - 2.*size/3.), abs(y - size/3.));
    r3 = max(abs(x),max(abs(x-size/3.), abs(y)));
    r = max(min(r1,r2),r3);
    r -= size/2;
    return r;
}
```

### markerCross
```
function markerCross(px,py,size){
  x = SQRT1_2 * (px - py);
  y = SQRT1_2 * (px + py);
  size = size/1.5
  r1 = max(abs(x - size), abs(x + size));
  r2 = max(abs(y - size), abs(y + size));
  r3 = max(abs(x), abs(y));
  r = max(min(r1,r2),r3);
  r -= size*1.5;
  return r;
}
```

### markerClobber
```
function markerClobber(px,py,size){
   size = size * 2
    c1y = -0.25;
    c2x = 0.216507
    c2y = 0.125;
    r1 = hypot(px, py - c1y*size) - size/3.5;
    r2 = hypot(px - c2x*size, py - c2y*size) - size/3.5;
    r3 = hypot(px + c2x*size, py - c2y*size) - size/3.5;
    return min(min(r1,r2),r3);
}
```

### markerAsterisk
```
function markerAsterisk(px,py,size){
   x = SQRT1_2 * (px - py);
   y = SQRT1_2 * (px + py);
   size = size * 2
   r1 = max(abs(x)- size/2., abs(y)- size/10.);
   r2 = max(abs(y)- size/2., abs(x)- size/10.);
   r3 = max(abs(px)- size/2., abs(py)- size/10.);
   r4 = max(abs(py)- size/2., abs(px)- size/10.);
   return min( min(r1,r2), min(r3,r4));
}
```

### markerChevron
```
function markerChevron(px,py,size){
    x = 1/SQRT2 * (px - py);
    y = 1/SQRT2 * (px + py);
    size = size * 2
    r1 = max(abs(x), abs(y)) - size/3;
    r2 = max(abs(x-size/3.), abs(y-size/3.)) - size/3.;
    return max(r1,-r2);
}
```

### markerRing
```
function markerRing(px,py,size){
    r1 = circle(px,py,size);
    r2 = circle(px,py,size/2);
    return max(r1,-r2);
}
```

### markerInfinity
```
function markerInfinity(px,py,size){
    c1x = .125
    size = size * 5
    r1 = circle(px-c1x*size,py,size/6);
    r2 = circle(px-c1x*size,py,size/14);
    r3 = circle(px+c1x*size,py,size/6);
    r4 = circle(px+c1x*size,py,size/14);
    return min( max(r1,-r2), max(r3,-r4));
}
```

### markerTag
```
function markerTag(px,py,size){
    x = -px;
    y = py;
    size = size * 3
    r1 = max(abs(x)- size/2., abs(y)- size/6.);
    r2 = abs(x-size/1.5)+abs(y)-size;
    return max(r1,.75*r2);
}
```
