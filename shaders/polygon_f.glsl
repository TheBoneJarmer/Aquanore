#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform bool u_texture_active;
uniform vec4 u_color;

in vec2 v_uv;

out vec4 result;

void main() {
    if (u_texture_active) {
        result = texture(u_texture, v_uv) * u_color;
    } else {
        result = u_color;
    }
}