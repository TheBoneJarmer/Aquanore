precision highp float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform int u_texture_active;
uniform int u_flip_hor;
uniform int u_flip_vert;
uniform vec4 u_color;

void main() {
    vec4 final_color = u_color;
    vec2 final_texcoord = v_texcoord;

    if (u_flip_hor == 1) {
        final_texcoord.x *= -1.0;
    }

    if (u_flip_vert == 1) {
        final_texcoord.y *= -1.0;
    }

    if (u_texture_active == 1) {
        final_color *= texture2D(u_texture, final_texcoord);
    }

    gl_FragColor = final_color;
}