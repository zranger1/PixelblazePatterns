var briScale = .4;
var theta;

export var sphere1Offset = 0;
export var sphere2Offset = 0;

function sphere(x,y,size,offset) {
  return 1 / hypot(x-offset,y) * size;
}

var t1;
export function beforeRender(delta) {
  t1 = 0.8*(-1+(triangle(-0.25+time(0.04)) * 2));
  sphere1Offset = -t1;
  sphere2Offset = t1;

  theta = PI2 * time(0.1);
  resetTransform();
  translate(-0.5,-0.5);  
  rotate(theta);  
}

export function render2D(index,x,y) {
    dist1 = sphere(x,y, 0.5,sphere1Offset);
    dist2 = sphere(x,y, 0.3,sphere2Offset);

    if (dist1 + dist2 < 5) {
      r1 = briScale * ((dist2-dist1)*6.2);
      g1 = briScale * (dist2 * dist1 * .6);
      b1 = briScale * (dist1-dist2) * .5;
      rgb(r1,g1,b1);
    }
    else {
      b1 = 1-(1/(dist1 + dist2)); 
      rgb(b1,b1,b1)      
    }  
}