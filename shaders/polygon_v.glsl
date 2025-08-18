precision highp float;

attribute vec2 a_vertex;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;
uniform vec2 u_rotation;
uniform vec2 u_translation;
uniform vec2 u_scale;
uniform vec2 u_origin;
uniform vec2 u_offset;
varying vec2 v_texcoord;

void main() {
    vec2 vertex = a_vertex - u_origin;
    vertex = vertex * u_scale;
    vertex = vec2(vertex.x * u_rotation.y + vertex.y * u_rotation.x, vertex.y * u_rotation.y - vertex.x * u_rotation.x);
    vertex = vertex + u_translation;
    vertex = vertex / u_resolution;
    vertex = (vertex * 2.0) - 1.0;
    v_texcoord = a_texcoord + u_offset;

    gl_Position = vec4(vertex.x, -vertex.y, 0, 1);
}