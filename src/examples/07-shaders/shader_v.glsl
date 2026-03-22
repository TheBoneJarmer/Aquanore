#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_vertex;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texcoord;
layout(location = 5) in vec4 a_joint;
layout(location = 6) in vec4 a_weight;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;
uniform mat4 u_mesh;
uniform mat4 u_joint[99];
uniform bool u_skinned;

out vec2 v_texcoord;
out vec3 v_normal;

mat4 get_matrix_model() {
    mat4 mat_skin = mat4(1.0f);

    if(u_skinned) {
        mat4 x = a_weight.x * u_joint[int(a_joint.x)];
        mat4 y = a_weight.y * u_joint[int(a_joint.y)];
        mat4 z = a_weight.z * u_joint[int(a_joint.z)];
        mat4 w = a_weight.w * u_joint[int(a_joint.w)];

        mat_skin = x + y + z + w;
    }

    return u_model * u_mesh * mat_skin;
}

mat4 get_matrix_mvp() {
    mat4 mat_model = get_matrix_model();
    mat4 mat_mvp = u_projection * u_view * mat_model;

    return mat_mvp;
}

void main() {
    mat4 mat_mvp = get_matrix_mvp();
    vec4 v = vec4(a_vertex, 1.0f);

    v_texcoord = a_texcoord;
    v_normal = u_normal * a_normal;

    gl_Position = mat_mvp * v;
}