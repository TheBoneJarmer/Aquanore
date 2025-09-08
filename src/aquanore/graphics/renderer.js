import { Aquanore } from "../aquanore";
import { Vector2, MathHelper, Matrix3, Matrix4, Vector3, Quaternion } from "../math";
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

    static drawModel(model, camera, lights, pos, rot, scale, animation = null, animationTime = 0) {
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
        const matProjection = this.#generateProjectionMatrix(camera);
        const matView = this.#generateViewMatrix(camera);
        const matModel = this.#generateModelMatrix(pos, rot, scale);
        const matNormal = this.#generateNormalMatrix(matModel);

        shader.umat4("u_projection", matProjection);
        shader.umat4("u_view", matView);
        shader.umat4("u_model", matModel);
        shader.umat3("u_normal", matNormal);
        shader.uvec3("u_camera", camera.position);

        for (let mesh of model.meshes) {
            this.#drawModel_Mesh(model, mesh, animation, animationTime);
        }
    }

    static #drawModel_Mesh(model, mesh, animation, animationTime) {
        const gl = Aquanore.ctx;
        const shader = this.#shader;

        if (mesh.skin != null) {
            const skin = model.skins[mesh.skin];

            for (let i = 0; i < skin.joints.length; i++) {
                const joint = model.joints.find(x => x.index == skin.joints[i]);
                const matInverse = skin.matrices[i];
                const matGlobal = this.getGlobalTransform(model, skin.joints[i], animation, animationTime);

                let matLocal = Matrix4.identity();
                matLocal = Matrix4.translate(matLocal, joint.translation.x, joint.translation.y, joint.translation.z);
                matLocal = Matrix4.rotate(matLocal, joint.rotation.x, joint.rotation.y, joint.rotation.z);
                matLocal = Matrix4.scale(matLocal, joint.scale.x, joint.scale.y, joint.scale.z);

                let mat = Matrix4.identity();
                mat = Matrix4.multiply(mat, matLocal);
                mat = Matrix4.multiply(mat, matGlobal);
                mat = Matrix4.multiply(mat, matInverse);

                shader.umat4(`u_joint[${i}]`, mat);
            }

            const matMesh = Matrix4.identity();
            shader.umat4("u_mesh", matMesh);
        } else {
            const localTransform = this.#generateMatrix(mesh);
            const animatedTransform = this.getAnimatedTransform(mesh.index, animation, animationTime);

            if (mesh.parent == null) {
                let mat = Matrix4.identity();
                mat = Matrix4.multiply(mat, localTransform);
                mat = Matrix4.multiply(mat, animatedTransform);

                shader.umat4("u_mesh", mat);
            } else {
                const globalTransform = this.getGlobalTransform(model, mesh.parent, animation, animationTime);

                let mat = Matrix4.identity();
                mat = Matrix4.multiply(mat, globalTransform);
                mat = Matrix4.multiply(mat, localTransform);
                mat = Matrix4.multiply(mat, animatedTransform);

                shader.umat4("u_mesh", mat);
            }
        }

        // Render primitive per primitive
        for (let pri of mesh.primitives) {
            const material = pri.material;
            const geom = pri.geometry;

            shader.u1b("u_skinned", mesh.skin != null);

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
    static #hasAnimations(animation, index) {
        if (animation == null) {
            return false;
        }

        const channels = animation.channels.filter(x => x.index == index);
        return channels.length > 0;
    }

    /* TRANSFORM FUNCTIONS */
    static getGlobalTransform(model, jointIndex, animation, animationTime, transform = null) {
        let joint = model.joints.find(x => x.index == jointIndex);
        let animatedTransform = this.getAnimatedTransform(jointIndex, animation, animationTime);

        if (transform == null) {
            transform = Matrix4.identity();
        }

        if (this.#hasAnimations(animation, jointIndex)) {
            transform = Matrix4.multiply(transform, animatedTransform);
        } else {
            transform = Matrix4.translate(transform, joint.translation.x, joint.translation.y, joint.translation.z);
            transform = Matrix4.rotate(transform, joint.rotation.x, joint.rotation.y, joint.rotation.z);
            transform = Matrix4.scale(transform, joint.scale.x, joint.scale.z, joint.scale.z);
        }

        if (joint.parent != null) {
            transform = this.getGlobalTransform(model, joint.parent, animation, animationTime, transform);
        }

        return transform;
    }

    static getAnimatedTransform(index, animation, animationTime) {
        let translation = new Vector3(0, 0, 0);
        let rotation = new Quaternion(0, 0, 0, 1);
        let scale = new Vector3(1, 1, 1);

        if (animation == null) {
            return Matrix4.identity();
        }

        const channels = animation.channels.filter(x => x.index == index);

        for (let channel of channels) {
            let prevTime = 0;
            let prevIndex = 0;
            let nextTime = channel.input[channel.input.length - 1];
            let nextIndex = channel.input.length - 1;
            let interpolation = channel.interpolation;

            // We only interpolate when the animation time is within our input range
            // Therefore we check it here because there is no point in figuring out the timesteps if we already exceeded the last one.
            if (animationTime >= nextTime) {
                interpolation = null;
            }

            if (interpolation == "STEP") {
                // TODO: Step interpolation
            }

            if (interpolation == "LINEAR") {

                // Figure out the largest smaller time before the current time as well as the smallest largest time after the current time
                for (let i = 0; i < channel.input.length - 1; i++) {
                    const time1 = channel.input[i + 0];
                    const time2 = channel.input[i + 1];

                    if (time1 < animationTime && time1 > prevTime) {
                        prevTime = time1;
                        prevIndex = i;
                    }

                    if (time2 > animationTime && time2 < nextTime) {
                        nextTime = time2;
                        nextIndex = i + 1;
                    }
                }

                // The linear interpolation value
                const value = prevIndex < nextIndex ? (animationTime - prevTime) / (nextTime - prevTime) : 0;

                // Now compute the lerp and slerp values accordingly
                // We are going to assume here that translation and scale are instances of Vector3 and rotations are instances of Quaternions
                if (channel.path === "translation") {
                    const prev = channel.output[prevIndex];
                    const next = channel.output[nextIndex];
                    const lerp = Vector3.lerp(prev, next, value);

                    translation = Vector3.add(translation, lerp);
                }

                if (channel.path === "rotation") {
                    const prev = channel.output[prevIndex];
                    const next = channel.output[nextIndex];
                    const slerp = Quaternion.slerp(prev, next, value);

                    rotation = Quaternion.mult(rotation, slerp);
                }

                if (channel.path === "scale") {
                    const prev = channel.output[prevIndex];
                    const next = channel.output[nextIndex];
                    const lerp = Vector3.lerp(prev, next, value);

                    scale = Vector3.mult(scale, lerp);
                }
            }

            if (interpolation == "CUBICSPLINE") {
                throw new Error("Cubic spline interpolation is not yet supported");
            }
        }

        let euler = Quaternion.toEuler(rotation);
        let m = Matrix4.identity();
        m = Matrix4.translate(m, translation.x, translation.y, translation.z);
        m = Matrix4.rotate(m, euler.x, euler.y, euler.z);
        m = Matrix4.scale(m, scale.x, scale.y, scale.z);

        return m;
    }

    /* MATRIX GENERATION FUNCTIONS */
    static #generateMatrix(obj) {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, obj.translation.x, obj.translation.y, obj.translation.z);
        m = Matrix4.rotate(m, obj.rotation.x, obj.rotation.y, obj.rotation.z);
        m = Matrix4.scale(m, obj.scale.x, obj.scale.y, obj.scale.z);

        return m;
    }

    static #generateTransformMatrix(transform) {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, transform.translation.x, transform.translation.y, transform.translation.z);
        m = Matrix4.rotate(m, transform.rotation.x, transform.rotation.y, transform.rotation.z);
        m = Matrix4.scale(m, transform.scale.x, transform.scale.y, transform.scale.z);

        return m;
    }

    static #generateModelMatrix(pos, rot, scale) {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
        m = Matrix4.scale(m, scale.x, scale.y, scale.z);

        return m;
    }

    static #generateViewMatrix(camera) {
        const pos = camera.position;
        const rot = camera.rotation;

        let m = Matrix4.identity();
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);

        return m;
    }

    static #generateProjectionMatrix(camera) {
        const fov = camera.fov;
        const near = camera.near;
        const far = camera.far;
        const aspect = camera.aspect;

        return Matrix4.perspective(fov, aspect, near, far);
    }

    static #generateNormalMatrix(mat) {
        const inversed = Matrix4.inverse(mat);
        const transposed = Matrix4.transpose(inversed);

        const result = Matrix3.from(transposed);
        return result;
    }
}
