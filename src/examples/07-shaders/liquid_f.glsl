#version 300 es
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

out vec4 result;

in vec2 v_texcoord;
in vec4 v_fragcoord;
in vec3 v_normal;

void main() {
    vec2 uv = -1.0f + 2.0f * v_fragcoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    vec3 color = vec3(0.0f);

    for(int i = 0; i < 128; i++) {
        float pha = sin(float(i) * 546.13f + 1.0f) * 0.5f + 0.5f;
        float siz = pow(sin(float(i) * 651.74f + 5.0f) * 0.5f + 0.5f, 4.0f);
        float pox = sin(float(i) * 321.55f + 4.1f) * iResolution.x / iResolution.y;
        float rad = 0.1f + 0.5f * siz + sin(pha + siz) / 4.0f;
        vec2 pos = vec2(pox + sin(iTime / 15.f + pha + siz), -1.0f - rad + (2.0f + 2.0f * rad) * mod(pha + 0.3f * (iTime / 7.f) * (0.2f + 0.8f * siz), 1.0f));
        float dis = length(uv - pos);
        vec3 col = mix(vec3(0.194f * sin(iTime / 6.0f) + 0.3f, 0.2f, 0.3f * pha), vec3(1.1f * sin(iTime / 9.0f) + 0.3f, 0.2f * pha, 0.4f), 0.5f + 0.5f * sin(float(i)));
        float f = length(uv - pos) / rad;

        f = sqrt(clamp(1.0f + (sin((iTime) * siz) * 0.5f) * f, 0.0f, 1.0f));
        color += col.zyx * (1.0f - smoothstep(rad * 0.15f, rad, dis));
    }

    color *= sqrt(1.5f - 0.5f * length(uv));
    result = vec4(color, 1.0);
}