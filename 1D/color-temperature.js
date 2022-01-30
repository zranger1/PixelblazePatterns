/*
   Convert color temperature in degrees kelvin to r,g,b color.

   Color temperature data from Mitchell Charity's blackbody data table:
       http://www.vendian.org/mncharity/dir3/blackbody/
   General approach (subdivide the data into regions that can modeled with simple,
   relatively inexpensive expressions) from Tanner Helland's blog:
      https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html

   IMPORTANT NOTE: Input color temperatures must be divided by 100 - e.g. to set a 
   temperature of 2500k, you would call ctToRGB(25). This conversion is valid from
   1000k (10) to 15,000k (150). It'll do *something* if given a temperature outside
   that range, but it is not guaranteed to be accurate, or even reasonable.
   
   For demo purposes, if you move the slider below 1000k (10), you get a slow sine
   wave of temperatures between 1000 and 8000k.
   
   2020 ZRanger1
  
*/

export var colorTemp;
var r,g,b

export function sliderColorTemp(t) {
    colorTemp = t * 150;
}

function ctToRGB(ct){
    
    if( ct < 67 ){ 
        r = 1;
        g = 0.5313 * log(ct) - 1.2909;
        
        if( ct <= 19){
            b = 0;
        } else {
            b = 0.0223 * ct - 0.5063;
        }
    } else {
        r = 38.309 * pow(ct,-0.886);
        g = 10.771 * pow(ct,-0.588);
        b = 1;
    }
    
    r = clamp(r,0, 1);
    g = clamp(g,0, 1);
    b = clamp(b,0, 1);
}

export function beforeRender(delta) {
  var ct; 
  ct = (colorTemp < 10) ? ct = 10+70 * wave(time(0.07)) : colorTemp;
  ctToRGB(ct);
}

export function render(index) {
  rgb(r,g,b);
}