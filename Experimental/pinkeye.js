/*
#version 120

// @paulofalcao
//
// Blue Pattern
//
// A old shader i had lying around
// Although it's really simple, I like the effect :)
// modified by @hintz

uniform float time;
uniform vec2 resolution;

void main(void)
{
    vec2 u=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
    float t=time*0.5;
    
    float tt=sin(t/8.0)*64.0;
    float x=u.x*tt+sin(t*2.1)*4.0;
    float y=u.y*tt+cos(t*2.3)*4.0;
    float c=sin(x)+sin(y);
    float zoom=sin(t);
    x=x*zoom*2.0+sin(t*1.1);
    y=y*zoom*2.0+cos(t*1.3);
    float xx=cos(t*0.7)*x-sin(t*0.7)*y;
    float yy=sin(t*0.7)*x+cos(t*0.7)*y;
    c=(sin(c+(sin(xx)+sin(yy)))+1.0)*0.4;
    float v=2.0-length(u)*2.0;
    gl_FragColor=vec4(v*vec3(c+v*0.4,c*c-0.5+v*0.5,c*1.9),1.0);
}
*/

translate(-0.5,-0.5)
//scale(1.3,1.3)


export function beforeRender(delta) {
  t = time(.5) * 80
}

export var v;
export function render2D(index,x,y) {
    tt=sin(t/8.0)*24.0;    
    x1=x*tt+sin(t*2.1)*4.5;
    y1=y*tt+cos(t*2.3)*4.5;
    c=sin(x1)+sin(y1);
    zoom=sin(t);      

    x1=x1*zoom*2.0+sin(t*1.1);
    y1=y1*zoom*2.0+cos(t*1.3);
    xx=cos(t*0.7)*x-sin(t*0.7)*y;
    yy=sin(t*0.7)*x+cos(t*0.7)*y;
    c=(sin(c+(sin(xx)+sin(yy)))+1.0)*0.4;
    v=2-(hypot(x,y) * 2);
    
    r = min(1,v * c+v*0.4);
    g = min(1,v * c*c-0.5+v*0.5);
    b = min(1,v * c*1.9);
    
    rgb(r*r,g*g,b*b);
}