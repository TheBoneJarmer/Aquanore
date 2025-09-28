#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_vertex;
layout(location = 1) in vec2 a_uv;

uniform vec2 u_resolution;
uniform vec2 u_rotation;
uniform vec2 u_translation;
uniform vec2 u_scale;

out vec2 v_uv;

void main() {
    vec2 vertex = a_vertex;
    vertex = vertex * u_scale;
    vertex = vec2(vertex.x * u_rotation.y + vertex.y * u_rotation.x, vertex.y * u_rotation.y - vertex.x * u_rotation.x);
    vertex = vertex + u_translation;
    vertex = vertex / u_resolution;
    vertex = (vertex * 2.0f) - 1.0f;

    v_uv = a_uv;

    gl_Position = vec4(vertex.x, -vertex.y, 0, 1);
}