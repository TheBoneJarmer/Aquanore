import { Aquanore } from "../aquanore";
import { LightType } from "../enums";
import { Vector2, MathHelper, Matrix3, Matrix4, Vector3, Quaternion } from "../math";
import { Color } from "./color";
import { BasicMaterial, StandardMaterial } from "./materials";
import { Model } from "./model";
import { ModelAnimation } from "./model-animation";
import { Polygon } from "./polygon";
import { Scene } from "./scene";
import { Shader, Shaders } from "./shaders";
import { Sprite } from "./sprite";
import { Texture } from "./texture";

export class Renderer {
    static #shader = null;
    static #shaderPolygon = null;
    static #shaderModel = null;
    static #shaderScreen = null;
    static #clearColor = null;

    static #vao = null;
    static #fboColor = null;
    static #fboShadow = null;
    static #colormap = null;
    static #depthmap = null;
    static #shadowmap = null;

    /**
     * Sets the polygon shader
     * @param {Shader} value
     */
    static set shaderPolygon(value) {
        this.#shaderPolygon = value;
    }

    /**
     * Sets the model shader
     * @param {Shader} value
     */
    static set shaderModel(value) {
        this.#shaderModel = value;
    }

    /**
     * Sets the screen shader
     * @param {Shader} value
     */
    static set shaderScreen(value) {
        this.#shaderScreen = value;
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
     * Returns the shadow map of the 3D scene. Be aware the shadow map is not an ordinary texture.
     * If you are planning to use this in a shader you need to use the data type `sampler2DShadow` instead of `sampler2D`.
     * @return {Texture}
     */
    static get shadowmap() {
        return this.#shadowmap;
    }

    /**
     * Returns the color map of the 3D scene.
     * @return {Texture}
     */
    static get colormap() {
        return this.#colormap;
    }

    /**
     * Returns the depth map of the 3D scene.
     * @return {Texture}
     */
    static get depthmap() {
        return this.#depthmap;
    }

    /**
     * Resets the renderer to its defaults. This method is automatically called every frame at the end of the loop.
     */
    static #reset() {
        this.#shader = null;
        this.#shaderPolygon = Shaders.polygon;
        this.#shaderModel = Shaders.model;
        this.#shaderScreen = Shaders.screen;
        this.#clearColor = new Color(0, 0, 0);

        Aquanore.ctx.useProgram(null);
    }

    /**
     * Manually switch to another shader. This function is called by every render function below but can be called manually as well.
     * @param {Shader} shader - The shader
     * @returns True if the switch succeeded or false if it didn't.
     */
    static switchShader(shader) {
        const gl = Aquanore.ctx;

        if (shader == null) {
            return false;
        }

        if (this.#shader != null && shader.id == this.#shader.id) {
            return false;
        }

        this.#shader = shader;
        gl.useProgram(this.#shader.id);

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
        const cnv = Aquanore.canvas;
        const cos = Math.cos(MathHelper.radians(angle + 90));
        const sin = Math.sin(MathHelper.radians(angle + 90));

        gl.bindVertexArray(polygon.vao);
        gl.uniform2f(gl.getUniformLocation(this.#shader.id, "u_resolution"), cnv.width, cnv.height);
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
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture.id);

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
     * @param {Vector3} pos - The model's position
     * @param {Vector3} rot - The model's rotation in euler angles
     * @param {Vector3} scale - The model's scale
     * @param {ModelAnimation} animation - If set, transforms the model's primitives based on the animation channels
     * @param {number} animationTime - If an animation is set, provides the current time for interpolation.
     */
    static drawModel(model, pos, rot, scale, animation = null, animationTime = 0) {
        if (!model) {
            return;
        }

        this.switchShader(this.#shaderModel);

        const gl = Aquanore.ctx;
        const shader = this.#shader;
        const light = Scene.lights.find(x => x.type == LightType.Directional);
        const matProjection = this.#generateProjectionMatrix(Scene.camera);
        const matView = this.#generateViewMatrix(Scene.camera);
        const matModel = this.#generateModelMatrix(pos, rot, scale);
        const matNormal = this.#generateNormalMatrix(matModel);
        const matDepthProjection = this.#generateDepthProjectionMatrix();
        const matDepthView = this.#generateDepthViewMatrix(light);

        shader.umat4("u_projection", matProjection);
        shader.umat4("u_view", matView);
        shader.umat4("u_model", matModel);
        shader.umat3("u_normal", matNormal);
        shader.umat4("u_depth_projection", matDepthProjection);
        shader.umat4("u_depth_view", matDepthView);
        shader.uvec3("u_camera", Scene.camera.position);
        shader.u1i("u_light_count", Scene.lights.length);

        // Set all lights
        for (let i = 0; i < Scene.lights.length; i++) {
            const light = Scene.lights[i];

            shader.u1i(`u_light[${i}].type`, light.type);
            shader.u1b(`u_light[${i}].enabled`, light.enabled);
            shader.uvec3(`u_light[${i}].source`, light.source);
            shader.ucolor(`u_light[${i}].color`, light.color);
            shader.u1f(`u_light[${i}].strength`, light.strength);
            shader.u1f(`u_light[${i}].range`, light.range);
        }

        // Set the shadow map
        gl.activeTexture(gl.TEXTURE31);
        gl.bindTexture(gl.TEXTURE_2D, this.#shadowmap.id);

        shader.u1i("u_shadow_map", 31);
        shader.u1b("u_shadow_map_active", Aquanore.options.graphics.shadow.enabled);

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

        shader.u1b("u_skinned", false);
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
        this.#__initVao();
        this.#__initColorAndDepthMap();
        this.#__initShadowMap();

        this.#reset();
    }

    static #__initVao() {
        const gl = Aquanore.ctx;
        const vertices = [0, 0, innerWidth, 0, 0, innerHeight, innerWidth, 0, 0, innerHeight, innerWidth, innerHeight];
        const uvs = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        const vao = gl.createVertexArray();
        const vboVertices = gl.createBuffer();
        const vboUVs = gl.createBuffer();

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboUVs);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        this.#vao = vao;
    }

    static #__initColorAndDepthMap() {
        const cnv = Aquanore.canvas;
        const result = this.#generateColorFramebuffer(cnv.width, cnv.height);

        this.#fboColor = result.fbo;
        this.#colormap = result.texColor;
        this.#depthmap = result.texDepth;
    }

    static #__initShadowMap() {
        const result = this.#generateShadowFramebuffer();

        this.#fboShadow = result.fbo;
        this.#shadowmap = result.tex;
    }

    static async __render() {
        await this.#__renderPhase1();
        await this.#__renderPhase2();
        await this.#__renderPhase3();

        this.#reset();
    }

    static async #__renderPhase1() {
        const options = Aquanore.options.graphics.shadow;
        if (!options.enabled) {
            return;
        }

        const gl = Aquanore.ctx;
        const shader = this.#shaderModel;

        // Render to the shadow fbo
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.FRONT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fboShadow);
        gl.viewport(0, 0, options.map.width, options.map.height);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Temp set the model shader to the shadow shader so every draw model call will use this shader instead
        this.#shaderModel = Shaders.shadow;

        if (Aquanore.onRender3D != null) {
            await Aquanore.onRender3D();
        }

        // And now reset the state to render normally again
        this.#shaderModel = shader;
    }

    static async  #__renderPhase2() {
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
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fboColor);
        gl.viewport(0, 0, cnv.width, cnv.height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (Aquanore.onRender3D != null) {
            await Aquanore.onRender3D();
        }
    }

    static async #__renderPhase3() {
        const gl = Aquanore.ctx;
        const cnv = Aquanore.canvas;

        const r = this.#clearColor.r / 255.0;
        const g = this.#clearColor.g / 255.0;
        const b = this.#clearColor.b / 255.0;
        const a = this.#clearColor.a / 255.0;

        // Render the color map to the screen using the screen shader
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, cnv.width, cnv.height);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);

        gl.useProgram(this.#shaderScreen.id);
        gl.uniform2f(gl.getUniformLocation(this.#shaderScreen.id, "u_resolution"), innerWidth, innerHeight);
        gl.uniform1i(gl.getUniformLocation(this.#shaderScreen.id, "u_colormap"), 0);
        gl.uniform1i(gl.getUniformLocation(this.#shaderScreen.id, "u_depthmap"), 1);
        gl.uniform1i(gl.getUniformLocation(this.#shaderScreen.id, "u_shadowmap"), 2);

        gl.bindVertexArray(this.#vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#colormap.id);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.#depthmap.id);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.#shadowmap.id);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);

        // And render the 2D scene on top of it
        if (Aquanore.onRender2D != null) {
            await Aquanore.onRender2D();
        }
    }

    static async __resize() {
        // Since we initialize our vao and maps with static data calculated from the resolution we must initialize all of them again
        // This is unfortunately rather costly
        this.#__initVao();
        this.#__initColorAndDepthMap();
    }

    /* HELPER FUNCTIONS */
    static #hasAnimationChannels(animation, obj) {
        if (animation == null) {
            return false;
        }

        const channels = animation.channels.filter(x => x.index == obj.index);
        return channels.length > 0;
    }

    static #generateColorFramebuffer(width, height) {
        const gl = Aquanore.ctx;

        // Generate the color attachment
        let texColor = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texColor);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Generate the depth attachment
        let texDepth = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texDepth);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);

        // Generate the framebuffer
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texColor, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texDepth, 0);

        // Check if the framebuffer is ok
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (status != gl.FRAMEBUFFER_COMPLETE) {
            throw new Error(`Failed to generate color framebuffer: ${status}.`);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        return {
            fbo: fbo,
            texColor: new Texture(width, height, texColor),
            texDepth: new Texture(width, height, texDepth)
        };
    }

    static #generateShadowFramebuffer() {
        const options = Aquanore.options.graphics.shadow;
        const gl = Aquanore.ctx;

        // Generate the attachment
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, options.map.width, options.map.height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);

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
            tex: new Texture(options.map.width, options.map.height, tex),
        };
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

    /* MATRIX FUNCTIONS */
    static #generateDepthProjectionMatrix() {
        const options = Aquanore.options.graphics.shadow;
        const frustrum = options.frustrum;

        return Matrix4.ortho(frustrum.left, frustrum.right, frustrum.top, frustrum.bottom, frustrum.near, frustrum.far);
    }

    static #generateDepthViewMatrix(light) {
        if (light == null) {
            return Matrix4.identity();
        }

        if (light.type == LightType.Directional) {
            return Matrix4.lookAt(light.source, Vector3.ZERO, Vector3.UP);
        }

        if (light.type == LightType.Point) {
            // TODO: Generate depth view matrix for point light
        }
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
