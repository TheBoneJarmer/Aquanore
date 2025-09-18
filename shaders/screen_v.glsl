#version 300 es
precision highp float;

layout(location = 0) in vec2 a_vertex;
layout(location = 1) in vec2 a_uv;

uniform vec2 u_resolution;

out vec2 v_uv;

void main() {
    vec2 vertex = a_vertex;
    vertex = vertex / u_resolution;
    vertex = (vertex * 2.0f) - 1.0f;

    v_uv = a_uv;

    gl_Position = vec4(vertex.x, vertex.y, 0, 1);
}