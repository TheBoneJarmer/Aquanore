import {Shader} from "./shader";

export class Shaders {
    private static _polygon: Shader;
    private static _sprite: Shader;

    public static get polygon(): Shader {
        return this._polygon;
    }

    public static get sprite(): Shader {
        return this._sprite;
    }

    private constructor() {
    }

    public static init() {
        this.initPolygon();
        this.initSprite();
    }

    private static initPolygon() {
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

        this._polygon = new Shader(vSource, fSource);
    }

    private static initSprite() {
        let vSource = "";
        let fSource = "";

        vSource += "attribute vec2 aposition;\n";
        vSource += "attribute vec2 atexcoord;\n";
        vSource += "uniform vec2 uresolution;\n";
        vSource += "uniform vec2 urotation;\n";
        vSource += "uniform vec2 utranslation;\n";
        vSource += "varying vec2 vtexcoord;\n";
        vSource += "\n";
        vSource += "void main() {\n";
        vSource += "vec2 rotatedPosition = vec2(aposition.x * urotation.y + aposition.y * urotation.x, aposition.y * urotation.y - aposition.x * urotation.x);\n";
        vSource += "vec2 zeroToOne = (rotatedPosition + utranslation) / uresolution;\n";
        vSource += "vec2 zeroToTwo = zeroToOne * 2.0;\n";
        vSource += "vec2 clipSpace = zeroToTwo - 1.0;\n";
        vSource += "\n";
        vSource += "vtexcoord = atexcoord;\n";
        vSource += "\n";
        vSource += "gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);\n";
        vSource += "}\n";

        fSource += "precision mediump float;\n";
        fSource += "uniform sampler2D uimage;\n";
        fSource += "uniform vec4 ucolor;\n";
        fSource += "varying vec2 vtexcoord;\n";
        fSource += "void main() {\n";
        fSource += "gl_FragColor = texture2D(uimage, vtexcoord) * ucolor;\n";
        fSource += "}";

        this._sprite = new Shader(vSource, fSource);
    }
}