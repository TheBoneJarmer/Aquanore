#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_color;

in vec2 v_uv;

out vec4 result;

void main() {
    result = texture(u_texture, v_uv) * u_color;
}