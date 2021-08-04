// Attempt to detect the Pixelblaze variant the pattern is
// currently running on, based on differences in capacitance 
// returned by touchRead on the "orange LED" GPIO Pin (GPIO12)
//
// Returns: 0 - Pixelblaze 2, 1 - Pixelblaze 3, 2 - Pixelblaze Nano
function getHardwareType() {
  var hw = 0;   // default to pb2
  
  var e = touchRead(12);
  if (e == 0) { hw = 2; }
  else if (e >= 0.99) hw = 1;
  
  return hw;
}  

// retrieve the Pixelblaze type
var hw = getHardwareType();

// Display red for pb2, green for pb3, blue for nano...
export function render(index) {
  h = hw * 0.3333;
  s = 1
  v = 1
  hsv(h, s, v)
}