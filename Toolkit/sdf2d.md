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
Required by one or more of the signed distance functions.
### Signum
```
// returns the sign of <a> as follows
// -1 if a < 0, 0 if a == 0, 1 if a > 0
function signum(a) {
  return (a > 0) - (a < 0)
}
```

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

### Hexagon
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
function cross(x,y,size) {
  x = abs(x); y = abs(y);
  
  if (y > x) { tmp = x; x = y; y = tmp; }
  qx = x - size; qy = y - size / 5;
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

# Operators

### Infinite Repeats
Careful about cx and cy.  They're the distance between
repeats in world coordinates.  A factor of 0.5 will
give you 3x3 repetitions across the display.  To far up or
down get messy on low res matrix displays.
```
  cx = 0.5;
  cy = 0.5;
  x = mod(x+0.5*cx,cx)-0.5*cx;
  y = mod(y+0.5*cy,cy)-0.5*cy;  
```

// cx,cy are the interval (in world coords) between repeats
function infiniteRepeat(x,y,cx,cy) {
  xOut = mod(x+0.5*cx,cx)-0.5*cx;
  yOut = mod(y+0.5*cy,cy)-0.5*cy;    
}

### Bend (X and Y)
Bend the shape around the specified axis.  Due to low
function bendX(x,y,k) {
  var c = cos(k*x); var s = sin(k*x);
  xOut = (c * x) + (s * y);
  yOut = (s * x) - (c * y);
}

function bendY(x,y,k) {
  var c = cos(k*y); var s = sin(k*y);
  xOut = (c * x) + (s * y);
  yOut = (s * x) - (c * y);
}
