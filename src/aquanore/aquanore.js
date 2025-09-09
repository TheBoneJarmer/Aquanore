import { Renderer } from "./graphics/renderer";
import { Color } from "./graphics";
import { Shaders } from "./graphics/shaders";
import { Joystick, Keyboard, Cursor } from "./input";
import { AquanoreOptions } from "./aquanore-options";

export class Aquanore {
    static #ctx = null;
    static #canvas = null;
    static #options = null;
    static #lastTime = 0;

    static get ctx() {
        if (this.#ctx == null) {
            this.#ctx = this.#canvas.getContext("webgl2");
        }

        return this.#ctx;
    }

    static get canvas() {
        return this.#canvas;
    }

    static onUpdate = null;
    static onRender2D = null;
    static onRender3D = null;
    static onLoad = null;
    static onResize = null;
    static clearColor = new Color(0, 0, 0, 255);

    static init(options = null) {
        this.#options = new AquanoreOptions();
        this.#lastTime = 0;

        if (options) {
            this.#options = options;
        }

        this.#initCanvas();
        this.#initListeners();

        Keyboard.init();
        Shaders.init();
        Cursor.init();
        Joystick.init();
        Renderer.reset();
    }

    static async run() {
        this.#lastTime = 0;

        if (this.onLoad != null) {
            await this.onLoad();
        }

        this.#callback(0);
    }

    static #initCanvas() {
        this.#canvas = document.createElement("canvas");
        this.#canvas.style.touchAction = "none";
        this.#canvas.width = this.#options.width;
        this.#canvas.height = this.#options.height;

        document.body.appendChild(this.#canvas);
    }

    static #initListeners() {
        window.addEventListener("resize", (e) => {
            if (this.#options.autoResize) {
                this.#canvas.width = window.innerWidth;
                this.#canvas.height = window.innerHeight;
            }

            if (this.onResize != null) {
                this.onResize(window.innerWidth, window.innerHeight);
            }
        });
    }

    static async #update(time) {
        const deltaTime = time - this.#lastTime;
        this.#lastTime = time;

        if (this.onUpdate != null) {
            await this.onUpdate(deltaTime / 1000.0);
        }

        Keyboard.update();
        Cursor.update();
        Joystick.update();
    }

    static async #render() {
        const gl = this.ctx;
        const ctx = this.canvas;

        const r = this.clearColor.r / 255.0;
        const g = this.clearColor.g / 255.0;
        const b = this.clearColor.b / 255.0;
        const a = this.clearColor.a / 255.0;

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, ctx.width, ctx.height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (this.onRender3D != null) {
            await this.onRender3D();
        }

        if (this.onRender2D != null) {
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);

            await this.onRender2D();
        }

        Renderer.reset();
    }

    static async #callback(time) {
        await Aquanore.#update(time);
        await Aquanore.#render();

        requestAnimationFrame(Aquanore.#callback);
    }
}
