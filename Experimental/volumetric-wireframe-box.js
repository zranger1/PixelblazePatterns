// Volumetric 3D wire-frame box!
//
// For volumetric displays only. Will probably not
// do the right thing on other display types!
//
// MIT License
// ZRanger1 1/2023


export var boxSize = 0.3;
export var edgeWidth = 0.0375;


// UI
export function sliderSize(v) {
  boxSize = 0.1+(v*v/4);
} 

export function sliderEdgeWidth(v) {
  edgeWidth = mix(0.025,0.08,v*v); 
}


// vector utilities
function max3(x,y,z) {
  return max(max(x,y),z);
}

function min3(x,y,z) {
  return min(min(x,y),z); 
}

// from https://iquilezles.org/articles/distfunctions/
// Returns signed distance to the edges of a box of size sz,
// with edge width e.
function wireframeBox( x,y,z,sz,e){
       px = abs(x)-sz;
       py = abs(y)-sz;
       pz = abs(z)-sz;
       
       qx = abs(px+e) - e;
       qy = abs(py+e) - e;
       qz = abs(pz+e) - e;   
       
       k1 = max3(px,qy,qz);  
       k2 = max3(qx,py,qz);
       k3 = max3(qx,qy,pz);
            
  return min(min(
      hypot(k1,0.0)+min(k1,0.0), 
      hypot(k2,0.0)+min(k2,0.0)),
      hypot(k3,0.0)+min(k3,0.0));
}

// tumble the box around a little
timebase = 0;
export function beforeRender(delta) {
  timebase = (timebase + delta /1000) % 3600;
  
  resetTransform();
  translate3D(-0.5,-0.5,-0.5);  
  rotateZ(timebase * 2);
  rotateX(timebase / 2); 
}

// I'm slightly cheesing the edge calculation here to gain a tiny
// bit of performance.Better math would have better anti-aliasing, but
// the resolution is so low that I think it looked better. YMMV.
export function render3D(index,x,y,z) {
  h = timebase + index/pixelCount
  hsv(h, 1, 1-wireframeBox(x,y,z,boxSize,edgeWidth)/edgeWidth)  
}

