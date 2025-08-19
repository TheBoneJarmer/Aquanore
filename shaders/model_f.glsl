precision highp float;

struct Texture {
    sampler2D data;
    bool enabled;
};

struct Material {
    vec4 diffuse;
    vec4 ambient;
    vec4 specular;

    Texture diffuse_map;
    Texture ambient_map;
    Texture specular_map;
};

uniform Material u_material;

varying vec2 texcoord;

void main() {
    vec4 result = vec4(1, 1, 1, 1);
    result *= u_material.diffuse;

    if (u_material.diffuse_map.enabled) {
        result *= texture2D(u_material.diffuse_map.data, texcoord);
    }

    gl_FragColor = result;
}