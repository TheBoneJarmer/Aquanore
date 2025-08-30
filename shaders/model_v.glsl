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
varying mat3 v_tbn;
varying vec3 v_frag;

void main() {
    mat4 mvp = u_projection * u_view * u_model;
    vec4 pos = vec4(a_vertex, 1.0);

    vec3 t = normalize(vec3(u_model * vec4(a_tangent, 0.0)));
    vec3 b = normalize(vec3(u_model * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(u_model * vec4(a_normal, 0.0)));

    v_texcoord = a_texcoord;
    v_vertex = a_vertex;
    v_normal = u_normal * a_normal;
    
    v_tbn = mat3(t, b, n);
    v_frag = vec3(u_model * pos);

    gl_Position = mvp * pos;
}