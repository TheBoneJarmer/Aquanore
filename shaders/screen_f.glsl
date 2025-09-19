#version 300 es
precision highp float;

uniform sampler2D u_colormap;
uniform sampler2D u_depthmap;
uniform mediump sampler2DShadow u_shadowmap;

in vec2 v_uv;

out vec4 result;

void main() {
    vec4 frag = texture(u_colormap, v_uv);

    result = frag;
}