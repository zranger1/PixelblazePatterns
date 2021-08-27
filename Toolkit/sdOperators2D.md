# 2D Signed Distance Operators for Pixelblaze
These operators let you duplicate, combine and alter the shapes of signed
distance functions.  (Very, very preliminary implementations -- will be changed
quite frequently for a while, till we arrive at something fast and easily useable. Z-08/19/21)

### Infinite Repeats
Careful about cx and cy.  They're the distance between
repeats in world coordinates.  A factor of 0.5 will
give you 3x3 repetitions across the display.  To far up or
down get messy on low res matrix displays.

The math:
```
  cx = 0.5;
  cy = 0.5;
  x = mod(x+0.5*cx,cx)-0.5*cx;
  y = mod(y+0.5*cy,cy)-0.5*cy;  
```

Small function to transform x and y coords:
```
// cx,cy are the interval (in world coords) between repeats
function infiniteRepeat(x,y,cx,cy) {
  xOut = mod(x+0.5*cx,cx)-0.5*cx;
  yOut = mod(y+0.5*cy,cy)-0.5*cy;    
}
```

### Bend (X and Y)
Bend the shape around the specified axis. 

```
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
```