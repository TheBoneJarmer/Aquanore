#version 300 es
precision mediump float;

out float frag_color;

void main() {
    frag_color = gl_FragCoord.z;
}