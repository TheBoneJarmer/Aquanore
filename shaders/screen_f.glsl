#version 300 es
precision highp float;

uniform sampler2D u_tex_color;
uniform sampler2D u_tex_depth;

in vec2 v_uv;

out vec4 result;

void main() {
    vec4 frag = vec4(1);
    frag *= texture(u_tex_color, v_uv);
    //frag *= texture(u_tex_depth, v_uv).r;

    result = frag;
}