// Rock concert light sweep effect prototype
// 
export var focus = PI/2;
var horizontalSpacing = 3;
var verticalSpacing = 2.3;
export var verticalSweep = 5;
export var intensity = 0.18;
export var beamWidth = 2;
export var speed = 80;
export var drive = 1.5;

translate(-0.5,-0.5);

// controls brightness/desaturation of center beam
export function sliderFocus(v) {
  focus = 0.00015+(v * PI / 2)
}

// number of beams emitted by each source
export function sliderBeamWidth(v) {
  beamWidth = 1+floor(v * 2);
}

// overall brightness & dispersion of each source
export function sliderIntensity(v) {
  intensity = .00015+v;
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


export function beforeRender(delta) {
  t1 = time(.2) * speed;
  t2 = 0.4*(-0.5+wave(time(0.08)));
  xOffset = t1 * 0.5;
  yOffset = t1 * 0.2;
}

var r,g,b,v;
var px,py,dx,dy;
export var c,k0,k1;
export function render2D(index,x,y) {
  r = 0;g = 0;b = 0;
  py = y + t2;  
  
  // process each of our 3 light sources
  for (var i = -1; i <= 1; i++) {
    px = t2+x + i/horizontalSpacing;
    v = i * verticalSpacing;
    dy = sin(yOffset+v);
    
    // is pixel within this source's region?
    if ((py*dy) < 0) {
      dx = sin(xOffset+v);
      c = px / py * dy * verticalSweep + dx;      
      if (abs(c) >= beamWidth) continue;
      
      // calculate intensity of beam at this pixel
      k0 = min(intensity/abs(sin(c)),drive);
      k1 = min(intensity/abs(sin(c+focus)),drive);

      // calculate and blend pixel's color, based on
      // distance from the beam center
      // k0 is inverse distance from beam center,
      // k1 from beam edge.
      // this particular mix is green at the edges,
      // blue/purple in the middle.
      r += 0.15 * k0 +  0.1 * k1;
      g += 0.035 * k0 + 0.5 * k1;
      b += 0.35 * k0 +  0.1* k1;
    }
  }
  
  // gamma correct and display
  rgb(r*r,g*g,b*b);
}