precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;
attribute vec4 a_joint;
attribute vec4 a_weight;

uniform float u_has_joints;
uniform float u_has_weights;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;
uniform mat4 u_mesh;
uniform mat4 u_joint[99];
uniform bool u_skinned;

varying vec2 v_texcoord;
varying vec3 v_vertex;
varying vec3 v_normal;
varying mat3 v_tbn;
varying vec3 v_frag;

varying vec4 v_debug;

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
    mat4 mat_skin = get_matrix_skin();
    mat4 mat_mvp = u_projection * u_view * u_model * u_mesh;

    if(u_skinned) {
        mat_mvp = u_projection * u_view * u_model * mat_skin;
    }

    return mat_mvp;
}

mat3 get_matrix_tbn() {
    vec3 t = normalize(vec3(u_model * vec4(a_tangent, 0.0)));
    vec3 b = normalize(vec3(u_model * vec4(a_bitangent, 0.0)));
    vec3 n = normalize(vec3(u_model * vec4(a_normal, 0.0)));

    return mat3(t, b, n);
}

void main() {
    mat4 mat_mvp = get_matrix_mvp();
    mat3 mat_tbn = get_matrix_tbn();
    vec4 v = vec4(a_vertex, 1.0);

    v_texcoord = a_texcoord;
    v_vertex = a_vertex;
    v_normal = u_normal * a_normal;

    v_tbn = mat_tbn;
    v_frag = vec3(u_model * v);
    v_debug = a_joint;

    gl_Position = mat_mvp * v;
}