// Random colors randomly dissolve and reform.
// Version 1.0.0 JEM(ZRanger1) 07/20/2020 

var mode = 0;
var sum = 0;
var pix = array (pixelCount);
var h = 0;

export function beforeRender(delta) {
  
  if (mode == 0) {  // brighter
    if (sum >= pixelCount) {
      mode = 1;
    }
    
  }
  else {  // darker
    if (sum <= 0) {
      mode = 0;
      h += .05;
    }
  }
  sum = 0;
}

export function render(index) {
  p = random(1) > 0.975;
  
  if (mode == 0) {
    if (p) { 
      pix[index] = min(1,pix[index] + random(0.5));
    }    
  }
  else if (p) {
    pix[index] = max(0,pix[index] - random(0.5));
  }
  
  hsv(h,1,pix[index]);  
  sum += pix[index];
}