#version 300 es
precision highp float;

layout(location = 0) in vec3 a_vertex;
layout(location = 5) in vec4 a_joint;
layout(location = 6) in vec4 a_weight;

uniform mat4 u_model;
uniform mat4 u_mesh;
uniform mat4 u_joint[99];
uniform bool u_skinned;
uniform mat4 u_view_shadow;
uniform mat4 u_projection_shadow;

mat4 get_matrix_skin() {
    if(u_skinned) {
        mat4 x = a_weight.x * u_joint[int(a_joint.x)];
        mat4 y = a_weight.y * u_joint[int(a_joint.y)];
        mat4 z = a_weight.z * u_joint[int(a_joint.z)];
        mat4 w = a_weight.w * u_joint[int(a_joint.w)];

        return x + y + z + w;
    }

    return mat4(1);
}

mat4 get_matrix_mvp() {
    return u_projection_shadow * u_view_shadow * u_model * u_mesh;
}

void main() {
    mat4 mat_skin = get_matrix_skin();
    mat4 mat_mvp = get_matrix_mvp();
    vec4 v = vec4(a_vertex, 1.0);

    gl_Position = mat_mvp * mat_skin * v;
}