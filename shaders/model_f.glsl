precision highp float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1
#define SPOT_LIGHT 2

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

struct Light {
    int type;
    vec3 source;
    vec4 color;
    bool enabled;
};

uniform Material u_material;
uniform Light u_light[100];
uniform int u_light_count;

varying vec3 vertex;
varying vec3 normal;
varying vec2 texcoord;
varying vec3 frag;

vec4 calc_dir_light(Light light) {
    vec3 light_dir = normalize(-light.source);
    float light_diff = max(dot(normal, light_dir), 0.0);

    vec4 ambient = u_material.ambient * light.color;
    vec4 diffuse = light_diff * light.color;

    return ambient + diffuse;
}

void main() {
    vec4 result = vec4(0,0,0, 1);

    for (int i=0; i<100; i++) {
        if (i >= u_light_count) {
            break;
        }

        if (!u_light[i].enabled) {
            continue;
        }

        if (u_light[i].type == DIRECTIONAL_LIGHT) {
            result += calc_dir_light(u_light[i]);
        }
    }

    gl_FragColor = result;
}