import { Aquanore } from "../aquanore";
import { Vector2, MathHelper, Matrix3, Matrix4, Vector3, Quaternion } from "../math";
import { Camera } from "./camera";
import { Color } from "./color";
import { Light } from "./light";
import { BasicMaterial, StandardMaterial } from "./materials";
import { Model } from "./model";
import { ModelAnimation } from "./model-animation";
import { Polygon } from "./polygon";
import { Shader, Shaders } from "./shaders";
import { Sprite } from "./sprite";
import { Texture } from "./texture";

export class Renderer {
    static #shader = null;
    static #shaderPolygon = null;
    static #shaderModel = null;
    static #clearColor = null;

    static #texShadow = null;
    static #fboShadow = null;

    /**
     * Sets the polygon shader
     * @param {Shader} value - The shader
     */
    static set shaderPolygon(value) {
        this.#shaderPolygon = value;
    }

    /**
     * Sets the model shader
     * @param {Shader} value - The shader
     */
    static set shaderModel(value) {
        this.#shaderModel = value;
    }

    /**
     * Returns the current clear color
     * @returns {Color}
     */
    static get clearColor() {
        return this.#clearColor;
    }

    /**
     * Sets the current clear color
     * @param {Color} value
     */
    static set clearColor(value) {
        this.#clearColor = value;
    }

    /**
     * Resets the renderer to its defaults. This method is automatically called every frame at the end of the loop.
     */
    static #reset() {
        this.#shader = null;
        this.#shaderPolygon = Shaders.polygon;
        this.#shaderModel = Shaders.model;
        this.#clearColor = new Color(0, 0, 0);

        Aquanore.ctx.useProgram(null);
    }

    /**
     * Manually switch to another shader. This function is called by every render function below but can be called manually as well.
     * @param {Shader} shader - The shader
     * @returns True if the switch succeeded or false if it didn't.
     */
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

    /**
     * Draws a sprite
     * @param {Sprite} sprite - The sprite to draw
     * @param {Vector2} pos - The sprite's position
     * @param {Vector2} scale - The sprite's scale
     * @param {Vector2} origin - The sprite's point of origin
     * @param {number} frameHor - If the sprite is a spritesheet, sets the horizontal frame.
     * @param {number} frameVert - If the sprite is a spritesheet, sets the vertical frame.
     * @param {number} angle - The sprite's angle in degrees
     * @param {boolean} flipHor - If true, flips the sprite horizontally
     * @param {boolean} flipVert - If true, flips the sprite vertically
     * @param {Color} color - The sprite's color
     */
    static drawSprite(sprite, pos, scale, origin, frameHor, frameVert, angle, flipHor, flipVert, color) {
        const offset = new Vector2(0, 0);
        offset.x = (1.0 / sprite.framesHor) * frameHor;
        offset.y = (1.0 / sprite.framesVert) * frameVert;

        this.drawPolygon(sprite.poly, pos, scale, origin, angle, color, sprite.tex, offset, flipHor, flipVert);
    }

    /**
     * Draws a polygon
     * @param {Polygon} polygon - The polygon to draw
     * @param {Vector2} pos - The polygon's position
     * @param {Vector2} scale - The polygon's scale
     * @param {Vector2} origin - The polygon's point of origin
     * @param {number} angle - The polygon's angle in degrees
     * @param {Color} color - The polygon's color
     * @param {Texture} texture - The polygon's texture
     * @param {Vector2} textureOffset - if a texture is set, this value sets the texture's offset.
     * @param {boolean} flipTextureHor - If a texture is set, flips the texture horizontally
     * @param {boolean} flipTextureVert - If a texture is set, flips the texture vertically
     */
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

    /**
     * 
     * @param {Model} model - The model to draw
     * @param {Camera} camera - The current active camera
     * @param {Light[]} lights - An array of lights
     * @param {Vector3} pos - The model's position
     * @param {Vector3} rot - The model's rotation in euler angles
     * @param {Vector3} scale - The model's scale
     * @param {ModelAnimation} animation - If set, transforms the model's primitives based on the animation channels
     * @param {number} animationTime - If an animation is set, provides the current time for interpolation.
     */
    static drawModel(model, camera, lights, pos, rot, scale, animation = null, animationTime = 0) {
        if (!model) {
            return;
        }

        this.switchShader(this.#shaderModel);

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

        for (let mesh of model.meshes) {
            this.#drawMesh_Animation(model, mesh, animation, animationTime);
            this.#drawMesh_Primitives(mesh);
        }
    }

    static #drawMesh_Animation(model, mesh, animation, time) {
        if (mesh.skin != null) {
            this.#drawMesh_Animation_Skinned(model, mesh, animation, time);
        } else {
            this.#drawMesh_Animation_Normal(model, mesh, animation, time);
        }
    }

    static #drawMesh_Animation_Normal(model, mesh, animation, time) {
        const shader = this.#shader;
        const localTransform = this.#getTransform(mesh);
        const animatedTransform = this.#getAnimatedTransform(mesh.index, animation, time);

        if (mesh.parent == null) {
            let mat = Matrix4.identity();
            mat = Matrix4.multiply(mat, localTransform);
            mat = Matrix4.multiply(mat, animatedTransform);

            shader.umat4("u_mesh", mat);
        } else {
            const root = model.joints.find(x => x.parent == null);
            const transforms = this.#getJointTransforms(model, root.index, animation, time, Matrix4.identity());
            const globalTransform = transforms.get(mesh.parent);

            let mat = Matrix4.identity();
            mat = Matrix4.multiply(mat, globalTransform);
            mat = Matrix4.multiply(mat, localTransform);
            mat = Matrix4.multiply(mat, animatedTransform);

            shader.umat4("u_mesh", mat);
        }
    }

    static #drawMesh_Animation_Skinned(model, mesh, animation, time) {
        const shader = this.#shader;
        const skin = model.skins[mesh.skin];
        const root = model.joints.find(x => x.parent == null);
        const transforms = this.#getJointTransforms(model, root.index, animation, time, Matrix4.identity());

        for (let i = 0; i < skin.joints.length; i++) {
            const transform = transforms.get(skin.joints[i]);

            let mat = Matrix4.identity();
            mat = Matrix4.multiply(mat, transform);
            mat = Matrix4.multiply(mat, skin.matrices[i]);

            shader.umat4(`u_joint[${i}]`, mat);
        }

        const matMesh = Matrix4.identity();
        shader.umat4("u_mesh", matMesh);
        shader.u1b("u_skinned", true);
    }

    static #drawMesh_Primitives(mesh) {
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

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.#__initShadows();

        this.#reset();
    }

    static #__initShadows() {
        const gl = Aquanore.ctx;
        const options = Aquanore.options.graphics.shadow;

        if (!options.enabled) {
            return;
        }

        // Generate the depth texture
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, options.map.width, options.map.height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.map.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.map.wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.map.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.map.magFilter);

        // Generate the frame buffer
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex, 0);

        // Check if the framebuffer is ok
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            throw new Error("Failed to generate shadowmap.");
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        this.#fboShadow = fbo;
        this.#texShadow = tex;
    }

    static async __begin() {
        const gl = Aquanore.ctx;
        const cnv = Aquanore.canvas;

        const r = this.#clearColor.r / 255.0;
        const g = this.#clearColor.g / 255.0;
        const b = this.#clearColor.b / 255.0;
        const a = this.#clearColor.a / 255.0;

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, cnv.width, cnv.height);
        gl.clearColor(r, g, b, a);
    }

    static async __end() {
        this.#reset();
    }

    static async __render3D() {
        const gl = Aquanore.ctx;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (Aquanore.onRender3D != null) {
            await Aquanore.onRender3D();
        }
    }

    static async __render2D() {
        const gl = Aquanore.ctx;

        if (Aquanore.onRender2D != null) {
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);

            await Aquanore.onRender2D();
        }
    }

    /* HELPER FUNCTIONS */
    static #hasAnimationChannels(animation, obj) {
        if (animation == null) {
            return false;
        }

        const channels = animation.channels.filter(x => x.index == obj.index);
        return channels.length > 0;
    }

    /* TRANSFORM FUNCTIONS */
    static #getTransform(obj) {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, obj.translation.x, obj.translation.y, obj.translation.z);
        m = Matrix4.rotate(m, obj.rotation.x, obj.rotation.y, obj.rotation.z);
        m = Matrix4.scale(m, obj.scale.x, obj.scale.y, obj.scale.z);

        return m;
    }

    static #getJointTransforms(model, jointIndex, animation, time, parent) {
        const result = new Map();
        const joint = model.joints.find(x => x.index == jointIndex);

        if (joint == null) {
            return [];
        }

        let transform = this.#getTransform(joint);
        let pose = this.#getAnimatedTransform(jointIndex, animation, time);

        let t = Matrix4.identity();
        t = Matrix4.multiply(t, parent);

        if (animation == null) {
            t = Matrix4.multiply(t, transform);
        } else if (!this.#hasAnimationChannels(animation, joint)) {
            t = Matrix4.multiply(t, transform);
        } else {
            t = Matrix4.multiply(t, pose);
        }

        for (let child of joint.children) {
            const childResult = this.#getJointTransforms(model, child, animation, time, t);

            childResult.forEach((value, key, map) => {
                result.set(key, value);
            });
        }

        result.set(jointIndex, t);
        return result;
    }

    static #getAnimatedTransform(index, animation, animationTime) {
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
            // if (animationTime >= nextTime) {
            //     interpolation = null;
            // }

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
