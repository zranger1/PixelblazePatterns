//  Red/White swirling strips for Christmas tree
//  with approximately conical spiral layout 
//  (and LED strips too, of course).
//
// No map required.
// 12/2022 ZRanger1

export var nStripes = 6
export var speed = 0.03
export var direction = 1;

export function sliderSpeed(v) {
  speed = 0.001+v*v
}

export function sliderStripes(v) {
  nStripes = 6*v;
}

export function beforeRender(delta) {
  t1 = direction * time(speed)
}

export function sliderDirection(v) {
  direction = (v < 0.5) ? -1 : 1;
}

export function render(index) {
  s = smoothstep(0,1,wave(t1+nStripes*index/pixelCount))
  hsv(0, s, 1)
}