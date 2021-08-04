// Rainbow Sine wave 
// MIT License
// 7/2021 ZRanger1

height = width = 16;

export function beforeRender(delta) {
;
}

export function render2D(index, x, y) {
  xPixel = floor(x * 16)
  yPixel = height - 1 - floor(y * height)
  
  yBall = floor(wave(x+time(0.04)) * height)
  
  if (yPixel == yBall) {
    rgb(1, 1, 1)
  } else if (yPixel < yBall) {
    hsv((yBall - yPixel) / height + wave(x), 1, 1) 
  } 
  
  // uncomment this for "correct" sine wave display
  else rgb(0,0,0)
}