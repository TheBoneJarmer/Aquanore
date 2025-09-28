#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_vertex;
layout(location = 1) in vec2 a_uv;

uniform vec2 u_resolution;
uniform vec2 u_rotation;
uniform vec2 u_translation;
uniform vec2 u_scale;
uniform vec2 u_origin;
uniform vec2 u_offset;
uniform bool u_flip_hor;
uniform bool u_flip_vert;

out vec2 v_uv;

vec2 generate_vertex() {
    vec2 v = a_vertex - u_origin;
    v = v * u_scale;
    v = vec2(v.x * u_rotation.y + v.y * u_rotation.x, v.y * u_rotation.y - v.x * u_rotation.x);
    v = v + u_translation;
    v = v / u_resolution;
    v = (v * 2.0f) - 1.0f;

    return v;
}

vec2 generate_uv() {
    vec2 v = a_uv;
    v += u_offset;

    if(u_flip_hor) {
        v.x *= -1.0f;
    }

    if(u_flip_vert) {
        v.y *= -1.0f;
    }

    return v;
}

void main() {
    vec2 vertex = generate_vertex();
    vec2 uv = generate_uv();

    v_uv = uv;

    gl_Position = vec4(vertex.x, -vertex.y, 0, 1);
}