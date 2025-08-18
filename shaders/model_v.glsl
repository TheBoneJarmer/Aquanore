precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    mat4 mat_mvp = u_projection * u_view * u_model;
    //mat3 mat_normal = mat3(transpose(inverse(u_model)));

    gl_Position = mat_mvp * vec4(a_vertex, 1.0);
}