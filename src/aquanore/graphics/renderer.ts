import { Aquanore } from "../aquanore";
import { Vector2, MathHelper, Vector3, Matrix3, Matrix4 } from "../math";
import { BasicMaterial, StandardMaterial } from "./materials";
import { Camera, Color, Light, Mesh, Model, Polygon, Sprite, Texture } from ".";
import { Shader, Shaders } from "./shaders";

export class Renderer {
    private static _shader: Shader = null;
    private static _shaderPolygon: Shader = null;
    private static _shaderModel: Shader = null;

    public static set shaderPolygon(value: Shader) {
        this._shaderPolygon = value;
    }

    public static set shaderModel(value: Shader) {
        this._shaderModel = value;
    }

    private constructor() {
    }

    public static reset() {
        this._shader = null;
        this._shaderPolygon = Shaders.polygon;
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

    public static drawModel(model: Model, camera: Camera, lights: Light[], pos: Vector3, rot: Vector3, scale: Vector3) {
        if (!model) {
            return;
        }

        if (this.switchShader(this._shaderModel)) {
            const shader = this._shader;

            shader.u1i("u_light_count", lights.length);

            for (let i = 0; i < lights.length; i++) {
                const light = lights[i];

                shader.u1i(`u_light[${i}].type`, light.type);
                shader.u1b(`u_light[${i}].enabled`, light.enabled);
                shader.uvec3(`u_light[${i}].source`, light.source);
                shader.ucolor(`u_light[${i}].color`, light.color);
                shader.u1f(`u_light[${i}].strength`, light.strength);
                shader.u1f(`u_light[${i}].range`, light.range);
            }
        }

        const shader = this._shader;

        const matProjection = this.generateProjectionMatrix(camera);
        const matView = this.generateViewMatrix(camera);
        const matModel = this.generateModelMatrix(pos, rot, scale);
        const matNormal = this.generateNormalMatrix(matModel);

        shader.umat4("u_projection", matProjection);
        shader.umat4("u_view", matView);
        shader.umat4("u_model", matModel);
        shader.umat3("u_normal", matNormal);
        shader.uvec3("u_camera", camera.position);

        // Render mesh per mesh
        for (let mesh of model.meshes) {
            this.drawModel_Mesh(mesh);
        }
    }

    private static drawModel_Mesh(mesh: Mesh) {
        const gl = Aquanore.ctx;
        const shader = this._shader;
        const material = mesh.material;

        if (material instanceof BasicMaterial) {
            shader.u1i("u_material_type", 0);
            shader.ucolor("u_material.color", material.color);
        }

        if (material instanceof StandardMaterial) {
            shader.u1i("u_material_type", 1);
            shader.ucolor("u_material.color", material.color);
            shader.ucolor("u_material.ambient", material.ambient);

            if (material.map != null) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, material.map.id);

                shader.u1b("u_material.tex_active", true);
            } else {
                shader.u1b("u_material.tex_active", false);
            }
        }

        gl.bindVertexArray(mesh.vao);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
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
        const aspect = camera.aspect;

        return Matrix4.perspective(fov, aspect, near, far);
    }

    private static generateNormalMatrix(mat: Matrix4): Matrix3 {
        const inversed = Matrix4.inverse(mat);
        const transposed = Matrix4.transpose(inversed);

        const result = Matrix3.from(transposed);
        return result;
    }
}
