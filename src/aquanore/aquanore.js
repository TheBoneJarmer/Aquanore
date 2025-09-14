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

    /**
     * Returns the WebGL context from the canvas
     * @returns {WebGL2RenderingContext}
     */
    static get ctx() {
        if (this.#ctx == null) {
            this.#ctx = this.#canvas.getContext("webgl2");
        }

        return this.#ctx;
    }

    /**
     * Returns the HTML canvas element
     * @returns {HTMLCanvasElement}
     */
    static get canvas() {
        return this.#canvas;
    }

    /**
     * Returns the options
     * @returns {AquanoreOptions}
     */
    static get options() {
        return this.#options;
    }

    static onUpdate = null;
    static onRender2D = null;
    static onRender3D = null;
    static onLoad = null;
    static onResize = null;
    static clearColor = new Color(0, 0, 0, 255);

    /**
     * Initializes Aquanore. This **must** be ran before doing anything else.
     * @param {AquanoreOptions} options (Optional) Initializes aquanore with a configuration
     */
    static init(options = new AquanoreOptions()) {
        this.#options = options;
        this.#lastTime = 0;

        this.#initCanvas();
        this.#initListeners();

        Keyboard.init();
        Shaders.init();
        Cursor.init();
        Joystick.init();
        Renderer.init();
    }

    /**
     * Starts the main loop
     */
    static async run() {
        this.#lastTime = 0;

        if (this.onLoad != null) {
            await this.onLoad();
        }

        this.#callback(0);
    }

    static #initCanvas() {
        if (this.#options.canvas.dom == null) {
            this.#canvas = document.createElement("canvas");
            this.#canvas.width = window.innerWidth;
            this.#canvas.height = window.innerHeight;

            document.body.appendChild(this.#canvas);
        } else {
            this.#canvas = this.#options.canvas.dom;
        }

        this.#canvas.style.touchAction = "none";
    }

    static #initListeners() {
        window.addEventListener("resize", (e) => {
            if (this.#options.canvas.autoResize) {
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
        const cnv = this.canvas;

        const r = this.clearColor.r / 255.0;
        const g = this.clearColor.g / 255.0;
        const b = this.clearColor.b / 255.0;
        const a = this.clearColor.a / 255.0;

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, cnv.width, cnv.height);
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
