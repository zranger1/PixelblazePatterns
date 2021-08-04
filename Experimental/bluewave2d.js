/*
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{

    vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
    //uPos -= vec2((resolution.x/resolution.y)/3.0, 0.0);//shift origin to center
    
    uPos.x -= 1.5;
    uPos.y -= -0.0;
    
    vec3 color = vec3(0.0);
    float vertColor = 0.0;
    for( float i = 0.0; i < 10.0; ++i )
    {
        float t = time * (1.5);
    
        uPos.y += sin( uPos.x*(i+5.0) + t+i/5.0 ) * 0.2;
        float fTemp = abs(1.0 / uPos.y / 190.0);
        vertColor += fTemp;
        color += vec3( fTemp*(0.0-i)/15555555555.0, fTemp*i/15.0, pow(fTemp,0.99)*1.5 );
    }
    
    vec4 color_final = vec4(color, 0);
    gl_FragColor = color_final;

}
*/

// dealing with time == 0;
// scaling of values
// clipping of colors
// effectiveness -- max number of lines/objects
export function beforeRender(delta) {
  t1 = time(.3) * 30;  // time is scaled to match speed of shader
  t = t1 * 1.05;  
}

var x1,y1,s,temp;
export var r,g,b;
export function render2D(index,x,y) {
  
  x1 = (1-x) + 1.5;
  y1 = 1-y;
  r = g = b = 0;
  for (i = 0; i < 3; i++) {

    y1 += sin(x1*(i*5) + (t + i/5)) * 0.4;
    temp = abs(1/y1/80)
    r += temp*i/1555;
    g += temp*i/155;
    b += temp*i;
  }

  r = min(1,r*r); g = min(1,g*g); b = min(1,b*b);
  rgb(r,g,b);
}