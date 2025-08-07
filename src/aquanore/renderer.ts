import { Shader } from "./shader";
import { Shaders } from "./shaders";
import { Polygon } from "./polygon";
import { Aquanore } from "./aquanore";
import { Vector2 } from "./vector2";
import { Color } from "./color";
import { MathHelper } from "./mathhelper";
import { Texture } from "./texture";
import { Sprite } from "./sprite";
import { BitmapFont } from "./bitmapfont";
import { Vector3 } from "./vector3";
import { Matrix4 } from "./matrix4";
import { Camera } from "./camera";

export class Renderer {
    private static _shader: Shader = null;
    private static _shaderPolygon: Shader = null;
    private static _shaderFont: Shader = null;
    private static _shaderModel: Shader = null;

    public static set shaderPolygon(value: Shader) {
        this._shaderPolygon = value;
    }

    public static set shaderFont(value: Shader) {
        this._shaderFont = value;
    }

    public static set shaderModel(value: Shader) {
        this._shaderModel = value;
    }

    private constructor() {
    }

    public static init() {
        this._shader = null;
        this._shaderPolygon = Shaders.polygon;
        this._shaderFont = Shaders.font;
        this._shaderModel = Shaders.model;

        Aquanore.ctx.useProgram(null);
    }

    public static switchShader(shader: Shader): boolean {
        if (shader == null) {
            return false;
        }

        if (this._shader != null && shader.id == this._shader.id) {
            return false;
        }

        this._shader = shader;
        Aquanore.ctx.useProgram(this._shader.id);

        return true;
    }

    public static drawSprite(sprite: Sprite, pos: Vector2, scale: Vector2, origin: Vector2, frameHor: number, frameVert: number, angle: number, flipHor: boolean, flipVert: boolean, color: Color) {
        const offset = new Vector2(0, 0);
        offset.x = (1.0 / sprite.framesHor) * frameHor;
        offset.y = (1.0 / sprite.framesVert) * frameVert;

        this.drawPolygon(sprite.poly, pos, scale, origin, angle, color, sprite.tex, offset, flipHor, flipVert);
    }

    public static drawPolygon(polygon: Polygon, pos: Vector2, scale: Vector2, origin: Vector2, angle: number, color: Color, texture: Texture | null = null, textureOffset: Vector2 | null = null, flipTextureHor: boolean = false, flipTextureVert: boolean = false) {
        if (!polygon) {
            return;
        }

        this.switchShader(this._shaderPolygon);

        const gl = Aquanore.ctx;
        const cos = Math.cos(MathHelper.radians(angle + 90));
        const sin = Math.sin(MathHelper.radians(angle + 90));

        gl.bindVertexArray(polygon.vao);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_resolution"), window.innerWidth, window.innerHeight);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_rotation"), cos, sin);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_translation"), pos.x, pos.y);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_scale"), scale.x, scale.y);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_origin"), origin.x, origin.y);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_offset"), 0, 0);
        gl.uniform4f(gl.getUniformLocation(this._shader.id, "u_color"), color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
        gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_texture_active"), 0);
        gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_flip_hor"), 0);
        gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_flip_vert"), 0);

        if (texture != null) {
            gl.bindTexture(gl.TEXTURE_2D, texture.id);
            gl.activeTexture(gl.TEXTURE0);

            gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_texture_active"), 1);
            gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_flip_hor"), flipTextureHor ? 1 : 0);
            gl.uniform1i(gl.getUniformLocation(this._shader.id, "u_flip_vert"), flipTextureVert ? 1 : 0);

            if (textureOffset != null) {
                gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_offset"), textureOffset.x, textureOffset.y);
            }
        }

        gl.drawArrays(gl.TRIANGLES, 0, polygon.vertices.length / 2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
    }

    public static drawText(font: BitmapFont, text: string, pos: Vector2, scale: Vector2, color: Color) {
        if (!font) {
            return;
        }

        this.switchShader(this._shaderFont);

        const gl = Aquanore.ctx;
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_resolution"), window.innerWidth, window.innerHeight);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_rotation"), 0, 1);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_scale"), scale.x, scale.y);
        gl.uniform4f(gl.getUniformLocation(this._shader.id, "u_color"), color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
        gl.bindTexture(gl.TEXTURE_2D, font.tex.id);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindVertexArray(font.vao);

        let advance = 0;

        for (let c of text) {
            const index = c.charCodeAt(0);
            const glyph = font.glyphs[index];

            if (!glyph) {
                continue;
            }

            let textX = pos.x + glyph.xoffset * scale.x + advance;
            let textY = pos.y + glyph.yoffset * scale.y;

            gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_translation"), textX, textY);
            gl.drawArrays(gl.TRIANGLES, index * 6, 6);

            advance += glyph.xadvance * scale.x;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
    }

    /* HELPER FUNCTIONS */
    private static generateModelMatrix(pos: Vector3, rot: Vector3, scale: Vector3): Matrix4 {
        let m = Matrix4.identity();
        m = Matrix4.scale(m, scale.x, scale.y, scale.z);
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);

        return m;
    }

    private static generateViewMatrix(camera: Camera): Matrix4 {
        const pos = camera.position;
        const rot = camera.rotation;

        let m = Matrix4.identity();
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);

        return m;
    }

    private static generateProjectionMatrix(camera: Camera): Matrix4 {
        const fov = camera.fov;
        const near = camera.near;
        const far = camera.far;
        const width = Aquanore.canvas.clientWidth;
        const height = Aquanore.canvas.clientHeight;

        return Matrix4.perspective(fov, width / height, near, far);
    }
}
