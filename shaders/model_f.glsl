precision highp float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

#define NO_MATERIAL -1
#define BASIC_MATERIAL 0
#define STANDARD_MATERIAL 1

struct Material {
    vec4 color;
    vec4 ambient;

    sampler2D color_map;
    bool color_map_active;
    sampler2D normal_map;
    bool normal_map_active;
};

struct Light {
    int type;
    vec3 source;
    vec4 color;
    bool enabled;
    float strength;
    float range;
};

uniform vec3 u_camera;
uniform Light u_light[100];
uniform int u_light_count;

uniform Material u_material;
uniform int u_material_type;

varying vec3 v_vertex;
varying vec3 v_normal;
varying vec2 v_texcoord;
varying mat3 v_tbn;
varying vec3 v_frag;

vec3 calc_dir_light(Light light) {
    vec3 normal = normalize(v_normal);

    if(u_material.normal_map_active) {
        normal = texture2D(u_material.normal_map, v_texcoord).rgb;
        normal = normal * 2.0 - 1.0;
        normal = normalize(v_tbn * normal);
    }

    vec3 light_dir = normalize(light.source);
    float light_diff = max(dot(normal, light_dir), 0.0);

    vec4 ambient = u_material.ambient * u_material.color;
    vec4 diffuse = u_material.color * light_diff;

    if(u_material.color_map_active) {
        vec4 color = texture2D(u_material.color_map, v_texcoord);

        ambient *= color;
        diffuse *= color;
    }

    return (ambient.xyz + diffuse.xyz) * light.color.xyz;
}

vec3 calc_point_light(Light light) {
    vec3 normal = normalize(v_normal);

    if(u_material.normal_map_active) {
        normal = texture2D(u_material.normal_map, v_texcoord).rgb;
        normal = normal * 2.0 - 1.0;
        normal = normalize(v_tbn * normal);
    }

    vec3 light_dir = normalize(light.source - v_frag);
    float light_diff = max(dot(normal, light_dir), 0.0);

    float light_dist = length(light.source - v_frag);
    float light_att = 1.0 / light_dist * light.strength;

    if(light_dist > light.range) {
        return vec3(0, 0, 0);
    }

    vec4 ambient = u_material.ambient * u_material.color * light_att;
    vec4 diffuse = u_material.color * light_diff * light_att;

    if(u_material.color_map_active) {
        vec4 color = texture2D(u_material.color_map, v_texcoord);

        ambient *= color;
        diffuse *= color;
    }

    return (ambient.xyz + diffuse.xyz) * light.color.xyz;
}

void main() {
    vec4 result = vec4(0, 0, 0, 1);

    if(u_material_type == BASIC_MATERIAL) {
        result.xyz = u_material.color.xyz;
    }

    if(u_material_type == STANDARD_MATERIAL) {
        for(int i = 0; i < 100; i++) {
            if(i >= u_light_count) {
                break;
            }

            if(!u_light[i].enabled) {
                continue;
            }

            if(u_light[i].type == DIRECTIONAL_LIGHT) {
                result.xyz += calc_dir_light(u_light[i]);
            }

            if(u_light[i].type == POINT_LIGHT) {
                result.xyz += calc_point_light(u_light[i]);
            }
        }
    }

    gl_FragColor = result;
}