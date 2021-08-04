/*
#version 120

// original https://www.shadertoy.com/view/wllcDH

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) 
{
    vec4 o;
    vec2 u=vec2(2.*gl_FragCoord.xy-resolution.xy)/resolution.y*4.;
    for(float i=1.;i<4.;i++)
        u.x+=cos(u.y*i*3.)*.1,
        u.xy += sin(u.x*u.x+u.y*u.y-time*7.),
        u+=cos(u*5.)*.1,
        o=cos(float(u*.4)+vec4(.2,.1,.1,0));
    gl_FragColor=o;
}

*/

var timebase = 0;
export var speed = 6;
export var distortion = 0.2;

translate(-0.5,-0.5);
scale(2.25,2.25);

export function sliderSpeed(v) {
  speed = 0.1+(7*v);
}

export function sliderDistortion(v) {
  distortion = (v*v*0.3);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
}


export function render2D(index,x,y) {
  var r,g,b,i,tmp;  
  
  for (i = 1; i < 3; i++) {
    x += cos(y*i*3) * distortion; 
    tmp = sin((x * x + y * y) - t1);
    x += tmp;  y += tmp;
    x += cos(x * 5) * distortion; 
    y += cos(y * 5) * distortion;
  }
  
  tmp = (x * 0.6) + 0.1;
  r = cos(tmp + 0.2);
  g = cos(tmp);
  b = cos(tmp);
  rgb(r*r*r,g*g*g,b*b*b);
}