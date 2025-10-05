#version 300 es
precision mediump float;

struct Material {
    bool cast_shadow;
    bool recv_shadow;
};

uniform Material u_material;
uniform int u_material_type;

out float frag_color;

void main() {
    if(u_material.cast_shadow) {
        frag_color = gl_FragCoord.z;
    } else {
        frag_color = 1.0f;
    }

    frag_color = 1.0f;
}