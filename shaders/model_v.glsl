precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;
attribute vec4 a_joint;
attribute vec4 a_weight;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;
uniform mat4 u_mesh;
uniform mat4 u_joints[99];

uniform int u_has_joints;
uniform int u_has_weights;

varying vec2 v_texcoord;
varying vec3 v_vertex;
varying vec3 v_normal;
varying mat3 v_tbn;
varying vec3 v_frag;

mat4 get_matrix_skin() {
    mat4 result = mat4(1);

    if(u_has_joints == 1 && u_has_weights == 1) {
        result = a_weight.x * u_joints[int(a_joint.x)] +
            a_weight.y * u_joints[int(a_joint.y)] +
            a_weight.z * u_joints[int(a_joint.z)] +
            a_weight.w * u_joints[int(a_joint.w)];
    }

    if(u_has_joints == 1 && u_has_weights == 0) {
        result = u_joints[int(a_joint.x)] +
            u_joints[int(a_joint.y)] +
            u_joints[int(a_joint.z)] +
            u_joints[int(a_joint.w)];
    }

    return result;
}

mat4 get_matrix_mvp() {
    return u_projection * u_view * u_model * u_mesh;
}

mat3 get_matrix_tbn() {
    vec3 t = normalize(vec3(u_model * vec4(a_tangent, 0.0)));
    vec3 b = normalize(vec3(u_model * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(u_model * vec4(a_normal, 0.0)));

    return mat3(t, b, n);
}

void main() {
    mat4 mat_mvp = get_matrix_mvp();
    mat4 mat_skin = get_matrix_skin();
    mat3 mat_tbn = get_matrix_tbn();
    vec4 v = vec4(a_vertex, 1.0) * mat_skin;

    v_texcoord = a_texcoord;
    v_vertex = a_vertex;
    v_normal = u_normal * a_normal;

    v_tbn = mat_tbn;
    v_frag = vec3(u_model * v);

    gl_Position = mat_mvp * v;
}