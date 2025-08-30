precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;

varying vec2 v_texcoord;
varying vec3 v_vertex;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_bitangent;
varying vec3 v_frag;

void main() {
    mat4 mvp = u_projection * u_view * u_model;
    vec4 pos = vec4(a_vertex, 1.0);

    v_texcoord = a_texcoord;
    v_vertex = a_vertex;
    v_normal = u_normal * a_normal;
    v_tangent = a_tangent;
    v_bitangent = a_bitangent;
    v_frag = vec3(u_model * pos);

    gl_Position = mvp * pos;
}