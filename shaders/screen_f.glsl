#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 result;

void main() {
    vec4 frag = texture(u_texture, v_uv);

    result = frag;
}