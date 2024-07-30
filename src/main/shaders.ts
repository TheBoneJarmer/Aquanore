import {Shader} from "./shader";

export class Shaders {
    private static _default: Shader;

    public static get default(): Shader {
        return this._default;
    }

    private constructor() {
    }

    public static init() {
        this.initDefault();
    }

    private static initDefault() {
        let vSource = "precision highp float;\n" +
            "\n" +
            "attribute vec2 a_vertex;\n" +
            "attribute vec2 a_texcoord;\n" +
            "\n" +
            "uniform vec2 u_resolution;\n" +
            "uniform vec2 u_rotation;\n" +
            "uniform vec2 u_translation;\n" +
            "uniform vec2 u_scale;\n" +
            "uniform vec2 u_origin;\n" +
            "uniform vec2 u_offset;\n" +
            "varying vec2 v_texcoord;\n" +
            "\n" +
            "void main() {\n" +
            "    vec2 vertex = a_vertex - u_origin;\n" +
            "    vertex = vertex * u_scale;\n" +
            "    vertex = vec2(vertex.x * u_rotation.y + vertex.y * u_rotation.x, vertex.y * u_rotation.y - vertex.x * u_rotation.x);\n" +
            "    vertex = vertex + u_translation;\n" +
            "    vertex = vertex / u_resolution;\n" +
            "    vertex = (vertex * 2.0) - 1.0;\n" +
            "    v_texcoord = a_texcoord + u_offset;\n" +
            "    \n" +
            "    gl_Position = vec4(vertex.x, -vertex.y, 0, 1);\n" +
            "}"

        let fSource = "precision highp float;\n" +
            "varying vec2 v_texcoord;\n" +
            "uniform sampler2D u_texture;\n" +
            "uniform int u_texture_active;\n" +
            "uniform int u_flip_hor;\n" +
            "uniform int u_flip_vert;\n" +
            "uniform vec4 u_color;\n" +
            "\n" +
            "void main() {\n" +
            "    vec4 final_color = u_color;\n" +
            "    vec2 final_texcoord = v_texcoord;\n" +
            "\n" +
            "    if (u_flip_hor == 1) {\n" +
            "        final_texcoord.x *= -1.0;\n" +
            "    }\n" +
            "\n" +
            "    if (u_flip_vert == 1) {\n" +
            "        final_texcoord.y *= -1.0;\n" +
            "    }\n" +
            "\n" +
            "    if (u_texture_active == 1) {\n" +
            "        final_color *= texture2D(u_texture, final_texcoord);\n" +
            "    }\n" +
            "\n" +
            "    gl_FragColor = final_color;\n" +
            "}"

        this._default = new Shader(vSource, fSource);
    }
}