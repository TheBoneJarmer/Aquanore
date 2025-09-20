#version 300 es
precision highp float;

layout(location = 0) in vec3 a_vertex;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texcoord;
layout(location = 3) in vec3 a_tangent;
layout(location = 4) in vec3 a_bitangent;
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
out mat3 v_tbn;
out vec3 v_frag;

mat4 get_matrix_model() {
    return u_model * u_mesh;
}

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

mat3 get_matrix_tbn() {
    mat4 mat_model = get_matrix_model();

    vec3 t = normalize(vec3(mat_model * vec4(a_tangent, 0.0)));
    vec3 b = normalize(vec3(mat_model * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(mat_model * vec4(a_normal, 0.0)));

    return mat3(t, b, n);
}

void main() {
    mat4 mat_model = get_matrix_model();
    mat4 mat_skin = get_matrix_skin();
    mat3 mat_tbn = get_matrix_tbn();
    vec4 v = vec4(a_vertex, 1.0);

    v_texcoord = a_texcoord;
    v_normal = u_normal * a_normal;

    v_tbn = mat_tbn;
    v_frag = vec3(mat_model * v);

    gl_Position = u_projection * u_view * mat_model * mat_skin * v;
}