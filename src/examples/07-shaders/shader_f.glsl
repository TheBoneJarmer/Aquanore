#version 300 es
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

out vec4 result;

void main() {
    result = vec4(0, 1, 1, 1);
}