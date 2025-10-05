#version 300 es
precision mediump float;

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

    bool cast_shadow;
    bool recv_shadow;
};

struct Light {
    int type;
    vec3 source;
    vec4 color;
    bool enabled;
    float strength;
    float range;
};

uniform Light u_light[100];
uniform int u_light_count;
uniform Material u_material;
uniform int u_material_type;
uniform mediump sampler2DShadow u_shadow_map;
uniform int u_shadow_light;
uniform bool u_shadow_enabled;

in vec3 v_normal;
in vec2 v_texcoord;
in mat3 v_tbn;
in vec3 v_frag;
in vec4 v_shadow;
in vec2 v_adjacent_pixels[5];

out vec4 result;

float calc_shadow() {
    Light light = u_light[u_shadow_light];
    float shadow_visibility = 1.0f;
    float shadow_spread = 1600.0f;

    vec3 light_dir = normalize(light.source);
    float bias = max(0.05f * 1.0f - dot(v_normal, light_dir), 0.005f);

    // for(int i = 0; i < 5; i++) {
    //     vec3 coords = v_shadow.xyz;
    //     coords = vec3(coords.xy + v_adjacent_pixels[i] / shadow_spread, coords.z - bias);

    //     float hit_value = texture(u_shadow_map, coords);
    //     float lit_value = max(hit_value, 0.85);

    //     shadow_visibility *= lit_value;
    // }

    vec3 coords = v_shadow.xyz;
    coords *= 0.5f + 0.5f;
    coords = vec3(coords.xy, coords.z - bias);

    float hit_value = texture(u_shadow_map, coords);
    float lit_value = max(hit_value, 0.5f);

    shadow_visibility *= lit_value;

    return shadow_visibility;
}

vec3 calc_dir_light(Light light, float shadow) {
    vec3 normal = normalize(v_normal);

    if(u_material.normal_map_active) {
        normal = texture(u_material.normal_map, v_texcoord).rgb;
        normal = normal * 2.0f - 1.0f;
        normal = normalize(v_tbn * normal);
    }

    vec3 light_dir = normalize(light.source);
    float light_diff = max(dot(normal, light_dir), 0.0f);

    vec4 ambient = u_material.ambient * u_material.color * shadow;
    vec4 diffuse = u_material.color * light_diff * shadow;

    if(u_material.color_map_active) {
        vec4 color = texture(u_material.color_map, v_texcoord);

        ambient *= color;
        diffuse *= color;
    }

    return (ambient.xyz + diffuse.xyz) * light.color.xyz;
}

vec3 calc_point_light(Light light) {
    vec3 normal = normalize(v_normal);

    if(u_material.normal_map_active) {
        normal = texture(u_material.normal_map, v_texcoord).rgb;
        normal = normal * 2.0f - 1.0f;
        normal = normalize(v_tbn * normal);
    }

    vec3 light_dir = normalize(light.source - v_frag);
    float light_diff = max(dot(normal, light_dir), 0.0f);

    float light_dist = length(light.source - v_frag);
    float light_att = 1.0f / light_dist * light.strength;

    if(light_dist > light.range) {
        return vec3(0, 0, 0);
    }

    vec4 ambient = u_material.ambient * u_material.color * light_att;
    vec4 diffuse = u_material.color * light_diff * light_att;

    if(u_material.color_map_active) {
        vec4 color = texture(u_material.color_map, v_texcoord);

        ambient *= color;
        diffuse *= color;
    }

    return (ambient.xyz + diffuse.xyz) * light.color.xyz;
}

void main() {
    result = vec4(0, 0, 0, 1);

    if(u_material_type == BASIC_MATERIAL) {
        result.xyz = u_material.color.xyz;
    }

    if(u_material_type == STANDARD_MATERIAL) {
        float shadow = 1.0f;

        if(u_shadow_enabled) {
            shadow = calc_shadow();
        }

        for(int i = 0; i < 100; i++) {
            if(i >= u_light_count) {
                break;
            }

            if(!u_light[i].enabled) {
                continue;
            }

            if(u_light[i].type == DIRECTIONAL_LIGHT) {
                result.xyz += calc_dir_light(u_light[i], shadow);
            }

            if(u_light[i].type == POINT_LIGHT) {
                result.xyz += calc_point_light(u_light[i]);
            }
        }
    }
}