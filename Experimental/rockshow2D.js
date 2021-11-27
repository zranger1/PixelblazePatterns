export var width = PI/2;
var horizontalSpacing = 3;
var verticalSpacing = 2.3;
export var verticalSweep = 5;
export var focus = 0.18;
export var speed = 80;
export var drive = 1.2;

// set default colors
var centerR = 0.1; var centerG = 0.7; var centerB = 0.12;
var edgeR = 0.34; var edgeG = .02; var edgeB = 0.98;

translate(-0.5,-0.5);

/*
export function rgbPickerCenter(r,g,b) {
 centerR = r; centerG = g; centerB = b;  
}

export function rgbPickerEdge(r,g,b) {
  edgeR = r; edgeG = g; edgeB = b;
}

// controls brightness/desaturation of center beam
export function sliderWidth(v) {
  width = 0.00015+(v * PI/2)
}

// overall brightness & dispersion of each source
export function sliderFocus(v) {
  focus = .00015+v;
}

// goes to 11...
export function sliderDrive(v) {
  drive = 1 + (10*v*v);
}

export function sliderSpeed(v) {
  speed = 50+(100*v);
}

// vertical vs horizontal motion 
export function sliderVerticalSweep(v) {
  verticalSweep = 1+(5*v);
}
*/

export function beforeRender(delta) {
  t1 = time(.2) * speed;
  t2 = 0.4*(-0.5+wave(time(0.08)));
  xOffset = t1 * 0.5;
  yOffset = t1 * 0.2;
}

var r,g,b,v;
var px,py,dx,dy;
var c,k0,k1;
export function render2D(index,x,y) {
  r = 0;g = 0;b = 0;
  py = y + t2;  
  
  // process each of our 3 light sources
  for (var i = -1; i <= 1; i++) {
    px = t2+x + i/horizontalSpacing;
    v = i * verticalSpacing;
    dy = sin(yOffset+v);
    
    // is pixel within this source's visible region?
    if ((py*dy) < 0) {
      dx = sin(xOffset+v);
      c = px / py * dy * verticalSweep + dx;      
      if (abs(c) >= 2) continue;  
      
      // calculate intensity at this pixel
      // k0 is the brightness of the center beam
      // k1 is the brightness of the edge beams
      k0 = min(focus/abs(sin(c)),drive);
      k1 = min(focus/abs(sin(c-width)),drive);

      if (k0 > k1) {
        k0 = k0 * k0;
        r += k0 * centerR; 
        g += k0 * centerG;
        b += k0 * centerB;
      }
      else {
        k1 = k1 * k1;
        r += k1 * edgeR; 
        g += k1 * edgeG;
        b += k1 * edgeB;
      }
    }
  }
  
  // limit range, gamma correct and display
  r = clamp(0,1,r); g = clamp(0,1,g); b = clamp(0,1,b);
  rgb(r,g,b);
}