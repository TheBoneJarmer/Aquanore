#version 300 es
precision highp float;

layout(location = 0) in vec3 a_vertex;

uniform mat4 u_model_depth;
uniform mat4 u_view_depth;
uniform mat4 u_projection_depth;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_mesh;

void main() {
    //mat4 mat_mvp = u_projection_depth * u_view_depth * u_model_depth;
    mat4 mat_mvp = u_projection * u_view * u_model * u_mesh;
    vec4 v = vec4(a_vertex, 1.0);

    gl_Position = mat_mvp * v;
}