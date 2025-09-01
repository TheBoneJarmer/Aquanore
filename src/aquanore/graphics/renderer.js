import { Aquanore } from "../aquanore";
import { Vector2, MathHelper, Matrix3, Matrix4 } from "../math";
import { BasicMaterial, StandardMaterial } from "./materials";
import { Shaders } from "./shaders";

export class Renderer {
    static #shader = null;
    static #shaderPolygon = null;
    static #shaderModel = null;

    static set shaderPolygon(value) {
        this.#shaderPolygon = value;
    }

    static set shaderModel(value) {
        this.#shaderModel = value;
    }

    static reset() {
        this.#shader = null;
        this.#shaderPolygon = Shaders.polygon;
        this.#shaderModel = Shaders.model;

        Aquanore.ctx.useProgram(null);
    }

    static switchShader(shader) {
        if (shader == null) {
            return false;
        }

        if (this.#shader != null && shader.id == this.#shader.id) {
            return false;
        }

        this.#shader = shader;
        Aquanore.ctx.useProgram(this.#shader.id);

        return true;
    }

    static drawSprite(sprite, pos, scale, origin, frameHor, frameVert, angle, flipHor, flipVert, color) {
        const offset = new Vector2(0, 0);
        offset.x = (1.0 / sprite.framesHor) * frameHor;
        offset.y = (1.0 / sprite.framesVert) * frameVert;

        this.drawPolygon(sprite.poly, pos, scale, origin, angle, color, sprite.tex, offset, flipHor, flipVert);
    }

    static drawPolygon(polygon, pos, scale, origin, angle, color, texture = null, textureOffset = null, flipTextureHor = false, flipTextureVert = false) {
        if (!polygon) {
            return;
        }

        this.switchShader(this.#shaderPolygon);

        const gl = Aquanore.ctx;
        const cos = Math.cos(MathHelper.radians(angle + 90));
        const sin = Math.sin(MathHelper.radians(angle + 90));

        gl.bindVertexArray(polygon.vao);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_resolution"), window.innerWidth, window.innerHeight);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_rotation"), cos, sin);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_translation"), pos.x, pos.y);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_scale"), scale.x, scale.y);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_origin"), origin.x, origin.y);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_offset"), 0, 0);
        gl.uniform4f(gl.getUniformLocation(this.#shader.id, "u_color"), color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
        gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_texture_active"), 0);
        gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_flip_hor"), 0);
        gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_flip_vert"), 0);

        if (texture != null) {
            gl.bindTexture(gl.TEXTURE_2D, texture.id);
            gl.activeTexture(gl.TEXTURE0);

            gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_texture_active"), 1);
            gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_flip_hor"), flipTextureHor ? 1 : 0);
            gl.uniform1i(gl.getUniformLocation(this.#shader.id, "u_flip_vert"), flipTextureVert ? 1 : 0);

            if (textureOffset != null) {
                gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_offset"), textureOffset.x, textureOffset.y);
            }
        }

        gl.drawArrays(gl.TRIANGLES, 0, polygon.vertices.length / 2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
    }

    static drawModel(model, camera, lights, pos, rot, scale) {
        if (!model) {
            return;
        }

        if (this.switchShader(this.#shaderModel)) {
            const shader = this.#shader;

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

        const shader = this.#shader;

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

    static drawModel_Mesh(mesh) {
        const gl = Aquanore.ctx;
        const shader = this.#shader;

        for (let pri of mesh.primitives) {
            const material = pri.material;
            const geom = pri.geometry;

            if (material instanceof BasicMaterial) {
                shader.u1i("u_material_type", 0);
                shader.ucolor("u_material.color", material.color);
            }

            if (material instanceof StandardMaterial) {
                shader.u1i("u_material_type", 1);
                shader.ucolor("u_material.color", material.color);
                shader.ucolor("u_material.ambient", material.ambient);
                shader.u1b("u_material.normal_map_active", false);
                shader.u1b("u_material.color_map_active", false);

                if (material.colorMap != null) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, material.colorMap.id);

                    shader.u1i("u_material.color_map", 0);
                    shader.u1b("u_material.color_map_active", true);
                }

                if (material.normalMap != null) {
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, material.normalMap.id);

                    shader.u1i("u_material.normal_map", 1);
                    shader.u1b("u_material.normal_map_active", true);
                }
            }

            gl.bindVertexArray(geom.vao);
            gl.drawElements(gl.TRIANGLES, geom.indices.length, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);
        }
    }

    /* HELPER FUNCTIONS */
    static generateModelMatrix(pos, rot, scale) {
        let m = Matrix4.identity();
        m = Matrix4.scale(m, scale.x, scale.y, scale.z);
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);

        return m;
    }

    static generateViewMatrix(camera) {
        const pos = camera.position;
        const rot = camera.rotation;

        let m = Matrix4.identity();
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);

        return m;
    }

    static generateProjectionMatrix(camera) {
        const fov = camera.fov;
        const near = camera.near;
        const far = camera.far;
        const aspect = camera.aspect;

        return Matrix4.perspective(fov, aspect, near, far);
    }

    static generateNormalMatrix(mat) {
        const inversed = Matrix4.inverse(mat);
        const transposed = Matrix4.transpose(inversed);

        const result = Matrix3.from(transposed);
        return result;
    }
}
