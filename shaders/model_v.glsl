precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;

varying vec2 texcoord;
varying vec3 vertex;
varying vec3 normal;
varying vec3 frag;

void main() {
    mat4 mat_mvp = u_projection * u_view * u_model;

    texcoord = a_texcoord;
    vertex = a_vertex;
    normal = a_normal * u_normal;
    frag = vec3(u_model * vec4(a_vertex, 1.0));

    gl_Position = mat_mvp * vec4(a_vertex, 1.0);
}