// Light pixels sequentially for about
// two seconds each. Can be helpful for
// mapping and debugging.

export function render(index) {
  // light the current pixel in green
  // change the value passed to time() to control speed
  // smaller == faster, larger == slower.  
  
  v = (index == floor(time(2) * pixelCount))
  hsv(0.3333, 1, v)
}