import { Aquanore } from "../aquanore";
import { Vector2, MathHelper, Matrix3, Matrix4, Vector3, Quaternion } from "../math";
import { Color } from "./color";
import { Joint } from "./joint";
import { BasicMaterial, StandardMaterial } from "./materials";
import { Mesh } from "./mesh";
import { Model } from "./model";
import { ModelAnimation } from "./model-animation";
import { Polygon } from "./polygon";
import { Scene } from "./scene";
import { Shader, Shaders } from "./shaders";
import { Sprite } from "./sprite";
import { Texture } from "./texture";
import { LightType } from "../enums";
import { Light } from "./light";
import { PerspectiveCamera } from "./perspective-camera";

export class Renderer {
    private static _shader: Shader;
    private static _shaderPolygon: Shader;
    private static _shaderModel: Shader;
    private static _clearColor: Color;

    private static _fboShadow: WebGLFramebuffer;
    private static _texShadow: Texture;

    /**
     * Sets the polygon shader
     * @param {Shader} value
     */
    static set shaderPolygon(value: Shader) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._shaderPolygon = value;
    }

    /**
     * Sets the model shader
     * @param {Shader} value
     */
    static set shaderModel(value: Shader) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._shaderModel = value;
    }

    /**
     * Returns the current clear color
     * @returns {Color}
     */
    static get clearColor(): Color {
        return this._clearColor;
    }

    /**
     * Sets the current clear color
     * @param {Color} value
     */
    static set clearColor(value: Color) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._clearColor = value;
    }

    /**
     * Resets the renderer to its defaults. This method is automatically called every frame at the end of the loop.
     */
    private static reset() {
        this._shader = null;
        this._shaderPolygon = Shaders.polygon;
        this._shaderModel = Shaders.model;
        this._clearColor = new Color(0, 0, 0);

        Aquanore.ctx.useProgram(null);
    }

    /**
     * Manually switch to another shader. This function is called by every render function below but can be called manually as well.
     * @param {Shader} shader - The shader
     * @returns True if the switch succeeded or false if it didn't.
     */
    static switchShader(shader: Shader) {
        const gl = Aquanore.ctx;

        if (shader == null) {
            return false;
        }

        if (this._shader != null && shader.id == this._shader.id) {
            return false;
        }

        this._shader = shader;
        gl.useProgram(this._shader.id);

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
    static drawSprite(sprite: Sprite, pos: Vector2, scale: Vector2, origin: Vector2, frameHor: number, frameVert: number, angle: number, flipHor: boolean, flipVert: boolean, color: Color) {
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
    static drawPolygon(polygon: Polygon, pos: Vector2, scale: Vector2, origin: Vector2, angle: number, color: Color, texture: Texture | null = null, textureOffset: Vector2 | null = null, flipTextureHor: boolean | null = false, flipTextureVert: boolean | null = false) {
        this.switchShader(this._shaderPolygon);

        const gl = Aquanore.ctx;
        const cnv = Aquanore.canvas;
        const cos = Math.cos(MathHelper.radians(angle + 90));
        const sin = Math.sin(MathHelper.radians(angle + 90));

        gl.bindVertexArray(polygon.vao);
        gl.uniform2f(gl.getUniformLocation(this._shader.id, "u_resolution"), cnv.width, cnv.height);
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
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture.id);

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

    /**
     * 
     * @param {Model} model - The model to draw
     * @param {Vector3} pos - The model's position
     * @param {Vector3} rot - The model's rotation in euler angles
     * @param {Vector3} scale - The model's scale
     * @param {ModelAnimation} animation - If set, transforms the model's primitives based on the animation channels
     * @param {number} animationTime - If an animation is set, provides the current time for interpolation.
     */
    static drawModel(model: Model, pos: Vector3, rot: Vector3, scale: Vector3, animation: ModelAnimation | null = null, animationTime: number | null = 0) {
        if (this.switchShader(this._shaderModel)) {
            const shader = this._shader;
            const gl = Aquanore.ctx;

            // Set the shadow map
            const lightIndex = Scene.lights.findIndex(x => x.type == LightType.Directional);
            const light = Scene.lights[lightIndex];
            const matProjectionShadow = this.generateShadowProjectionMatrix(light, -16, 16, 16, -16, -16, 16);
            const matViewShadow = this.generateShadowViewMatrix(light);
            const matTSC = new Matrix4([
                0.5, 0.0, 0.0, 0.0,
                0.0, 0.5, 0.0, 0.0,
                0.0, 0.0, 0.5, 0.0,
                0.5, 0.5, 0.5, 1.0
            ]);

            shader.umat4("u_projection_shadow", matProjectionShadow);
            shader.umat4("u_view_shadow", matViewShadow);
            shader.umat4("u_tsc", matTSC);
            shader.u1i("u_shadow_map", 31);
            shader.u1i("u_shadow_light", lightIndex);

            gl.activeTexture(gl.TEXTURE31);
            gl.bindTexture(gl.TEXTURE_2D, this._texShadow.id);

            // Set all lights
            shader.u1i("u_light_count", Scene.lights.length);

            for (let i = 0; i < Scene.lights.length; i++) {
                const light = Scene.lights[i];

                shader.u1i(`u_light[${i}].type`, light.type);
                shader.u1b(`u_light[${i}].enabled`, light.enabled);
                shader.uvec3(`u_light[${i}].source`, light.source);
                shader.ucolor(`u_light[${i}].color`, light.color);
                shader.u1f(`u_light[${i}].strength`, light.strength);
                shader.u1f(`u_light[${i}].range`, light.range);
            }

            // Set some matrices that stay consistent in this function regardless of the other input
            const matProjection = Scene.camera.projectionMatrix;
            const matView = Scene.camera.viewMatrix;

            shader.umat4("u_projection", matProjection);
            shader.umat4("u_view", matView);
        }

        const shader = this._shader;
        const matModel = this.generateModelMatrix(pos, rot, scale);
        const matNormal = this.generateNormalMatrix(matModel);

        shader.umat4("u_model", matModel);
        shader.umat3("u_normal", matNormal);

        // Draw all primitives
        for (let mesh of model.meshes) {
            this.drawMesh_Animation(model, mesh, animation, animationTime);
            this.drawMesh_Primitives(mesh);
        }
    }

    private static drawMesh_Animation(model: Model, mesh: Mesh, animation: ModelAnimation | null, time: number | null) {
        if (mesh.skin != null) {
            this.drawMesh_Animation_Skinned(model, mesh, animation, time);
        } else {
            this.drawMesh_Animation_Normal(model, mesh, animation, time);
        }
    }

    private static drawMesh_Animation_Normal(model: Model, mesh: Mesh, animation: ModelAnimation | null, time: number | null) {
        const shader = this._shader;
        const localTransform = this.getTransform(mesh);
        const animatedTransform = this.getAnimatedTransform(mesh.index, animation, time);

        if (mesh.parent == null) {
            let mat = Matrix4.identity();
            mat = Matrix4.multiply(mat, localTransform);
            mat = Matrix4.multiply(mat, animatedTransform);

            shader.umat4("u_mesh", mat);
        } else {
            const root = model.joints.find(x => x.parent == null);
            const transforms = this.getJointTransforms(model, root.index, animation, time, Matrix4.identity());
            const globalTransform = transforms.get(mesh.parent);

            let mat = Matrix4.identity();
            mat = Matrix4.multiply(mat, globalTransform);
            mat = Matrix4.multiply(mat, localTransform);
            mat = Matrix4.multiply(mat, animatedTransform);

            shader.umat4("u_mesh", mat);
        }

        shader.u1b("u_skinned", false);
    }

    private static drawMesh_Animation_Skinned(model: Model, mesh: Mesh, animation: ModelAnimation | null, time: number | null) {
        const shader = this._shader;
        const skin = model.skins[mesh.skin];
        const root = model.joints.find(x => x.parent == null);
        const transforms = this.getJointTransforms(model, root.index, animation, time, Matrix4.identity());

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

    private static drawMesh_Primitives(mesh: Mesh) {
        const gl = Aquanore.ctx;
        const shader = this._shader;

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
                shader.u1i("u_material.color_map", 0);
                shader.u1i("u_material.normal_map", 1);

                if (material.colorMap != null) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, material.colorMap.id);

                    shader.u1b("u_material.color_map_active", true);
                }

                if (material.normalMap != null) {
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, material.normalMap.id);

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
        this.__initShadowMap();

        this.reset();
    }

    private static __initShadowMap() {
        const result = this.generateShadowFramebuffer(4096, 4096);

        this._fboShadow = result.fbo;
        this._texShadow = result.tex;
    }

    static async __render() {
        await this.__renderPhase1();
        await this.__renderPhase2();

        this.reset();
    }

    private static async __renderPhase1() {
        const gl = Aquanore.ctx;
        const shader = this._shaderModel;

        // Render to the shadow fbo
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fboShadow);
        gl.viewport(0, 0, 4096, 4096);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Temp set the model shader to the shadow shader so every draw model call will use this shader instead
        this._shaderModel = Shaders.shadow;

        if (Aquanore.onRender3D != null) {
            await Aquanore.onRender3D();
        }

        // And now reset the state to render normally again
        this._shaderModel = shader;
    }

    private static async __renderPhase2() {
        const gl = Aquanore.ctx;
        const cnv = Aquanore.canvas;

        const r = this._clearColor.r / 255.0;
        const g = this._clearColor.g / 255.0;
        const b = this._clearColor.b / 255.0;
        const a = this._clearColor.a / 255.0;

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, cnv.width, cnv.height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (Aquanore.onRender3D != null) {
            await Aquanore.onRender3D();
        }

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        if (Aquanore.onRender2D != null) {
            await Aquanore.onRender2D();
        }
    }

    static async __resize() {

    }

    /* HELPER FUNCTIONS */
    private static generateShadowFramebuffer(width: number, height: number) {
        const gl = Aquanore.ctx;

        // Generate the attachment
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);

        // Generate the framebuffer
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex, 0);

        // Check if the framebuffer is ok
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (status != gl.FRAMEBUFFER_COMPLETE) {
            throw new Error(`Failed to generate framebuffer: ${status}.`);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        return {
            fbo: fbo,
            tex: new Texture(width, height, tex),
        };
    }

    private static hasAnimationChannels(animation: ModelAnimation | null, obj: Mesh | Joint): boolean {
        if (animation == null) {
            return false;
        }

        const channels = animation.channels.filter(x => x.index == obj.index);
        return channels.length > 0;
    }

    /* TRANSFORM FUNCTIONS */
    private static getTransform(obj: Mesh | Joint): Matrix4 {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, obj.translation.x, obj.translation.y, obj.translation.z);
        m = Matrix4.rotate(m, obj.rotation.x, obj.rotation.y, obj.rotation.z);
        m = Matrix4.scale(m, obj.scale.x, obj.scale.y, obj.scale.z);

        return m;
    }

    private static getJointTransforms(model: Model, jointIndex: number, animation: ModelAnimation | null, time: number | null, parent: Matrix4): Map<number, Matrix4> {
        const result = new Map();
        const joint = model.joints.find(x => x.index == jointIndex);

        if (joint == null) {
            return new Map();
        }

        let transform = this.getTransform(joint);
        let pose = this.getAnimatedTransform(jointIndex, animation, time);

        let t = Matrix4.identity();
        t = Matrix4.multiply(t, parent);

        if (animation == null) {
            t = Matrix4.multiply(t, transform);
        } else if (!this.hasAnimationChannels(animation, joint)) {
            t = Matrix4.multiply(t, transform);
        } else {
            t = Matrix4.multiply(t, pose);
        }

        for (let child of joint.children) {
            const childResult = this.getJointTransforms(model, child, animation, time, t);

            childResult.forEach((value, key, map) => {
                result.set(key, value);
            });
        }

        result.set(jointIndex, t);
        return result;
    }

    private static getAnimatedTransform(index: number, animation: ModelAnimation | null, time: number | null): Matrix4 {
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

                    if (time1 < time && time1 > prevTime) {
                        prevTime = time1;
                        prevIndex = i;
                    }

                    if (time2 > time && time2 < nextTime) {
                        nextTime = time2;
                        nextIndex = i + 1;
                    }
                }

                // The linear interpolation value
                const value = prevIndex < nextIndex ? (time - prevTime) / (nextTime - prevTime) : 0;

                // Now compute the lerp and slerp values accordingly
                // We are going to assume here that translation and scale are instances of Vector3 and rotations are instances of Quaternions
                if (channel.path === "translation") {
                    const prev = channel.output[prevIndex] as Vector3;
                    const next = channel.output[nextIndex] as Vector3;
                    const lerp = Vector3.lerp(prev, next, value);

                    translation = Vector3.add(translation, lerp);
                }

                if (channel.path === "rotation") {
                    const prev = channel.output[prevIndex] as Quaternion;
                    const next = channel.output[nextIndex] as Quaternion;
                    const slerp = Quaternion.slerp(prev, next, value);

                    rotation = Quaternion.mult(rotation, slerp);
                }

                if (channel.path === "scale") {
                    const prev = channel.output[prevIndex] as Vector3;
                    const next = channel.output[nextIndex] as Vector3;
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

    /* MATRIX FUNCTIONS */
    private static generateShadowProjectionMatrix(light: Light, left: number, right: number, top: number, bottom: number, near: number, far: number) {
        if (light == null) {
            return Matrix4.identity();
        }

        return Matrix4.ortho(left, right, top, bottom, near, far);
    }

    private static generateShadowViewMatrix(light: Light) {
        if (light == null) {
            return Matrix4.identity();
        }

        const source = new Vector3();
        source.x = light.source.x;
        source.y = light.source.y;
        source.z = light.source.z;

        const target = new Vector3(0, 0, 0);
        const up = new Vector3(0, 1, 0);

        return Matrix4.lookAt(source, target, up);
    }

    private static generateModelMatrix(pos: Vector3, rot: Vector3, scale: Vector3): Matrix4 {
        let m = Matrix4.identity();
        m = Matrix4.translate(m, pos.x, pos.y, pos.z);
        m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
        m = Matrix4.scale(m, scale.x, scale.y, scale.z);

        return m;
    }

    private static generateNormalMatrix(mat: Matrix4): Matrix3 {
        const inversed = Matrix4.inverse(mat);
        const transposed = Matrix4.transpose(inversed);

        const result = Matrix3.from(transposed);
        return result;
    }
}
