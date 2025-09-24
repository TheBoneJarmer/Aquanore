#version 300 es
precision mediump float;

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
uniform mat4 u_projection_shadow;
uniform mat4 u_view_shadow;
uniform mat4 u_tsc_shadow;
uniform bool u_skinned;

out vec2 v_texcoord;
out vec3 v_normal;
out mat3 v_tbn;
out vec3 v_frag;
out vec4 v_shadow;
out vec2 v_adjacent_pixels[5];

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

mat4 get_matrix_mvp_shadow() {
    mat4 mat_model = get_matrix_model();
    return u_tsc_shadow * u_projection_shadow * u_view_shadow * mat_model;
}

mat4 get_matrix_mvp() {
    mat4 mat_model = get_matrix_model();
    return u_projection * u_view * mat_model;
}

mat3 get_matrix_tbn() {
    mat4 mat_model = get_matrix_model();

    vec3 t = normalize(vec3(mat_model * vec4(a_tangent, 0.0f)));
    vec3 b = normalize(vec3(mat_model * vec4(a_bitangent, 0.0f)));
    vec3 n = normalize(vec3(mat_model * vec4(a_normal, 0.0f)));

    return mat3(t, b, n);
}

void main() {
    mat4 mat_model = get_matrix_model();
    mat3 mat_tbn = get_matrix_tbn();
    mat4 mat_mvp_shadow = get_matrix_mvp_shadow();
    mat4 mat_mvp = get_matrix_mvp();
    vec4 v = vec4(a_vertex, 1.0f);

    v_texcoord = a_texcoord;
    v_normal = u_normal * a_normal;

    v_tbn = mat_tbn;
    v_frag = vec3(mat_model * v);
    v_shadow = mat_mvp_shadow * v;
    v_adjacent_pixels = vec2[](vec2(0, 0), vec2(-1, 0), vec2(1, 0), vec2(0, 1), vec2(0, -1));

    gl_Position = mat_mvp * v;
}