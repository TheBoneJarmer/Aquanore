#version 300 es
precision highp float;

layout(location = 0) out float result;

void main() {
    result = gl_FragCoord.z;
}