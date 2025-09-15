import { Renderer } from "./graphics/renderer";
import { Color, Scene } from "./graphics";
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
     * @returns {WebGLRenderingContext}
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

    /**
     * Initializes Aquanore. This **must** be ran before doing anything else.
     * @param {AquanoreOptions} options (Optional) Initializes aquanore with a configuration
     */
    static init(options = new AquanoreOptions()) {
        this.#options = options;
        this.#lastTime = 0;

        this.#initCanvas();
        this.#initListeners();

        // Run all init methods from the static classes
        Keyboard.__init();
        Shaders.__init();
        Cursor.__init();
        Joystick.__init();
        Renderer.__init();
        Scene.__init();
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

    /**
     * Log WebGL related info
     */
    static info() {
        const gl = this.#ctx;
        const webglVersion = gl.getParameter(gl.VERSION);
        const glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        const extensions = gl.getSupportedExtensions();

        console.log(`[INFO]`);
        console.log(`WebGL Version: ${webglVersion}`);
        console.log(`GLSL Version: ${glslVersion}`);
        console.log(``);
        console.log(`[EXTENSIONS]`);

        for (let ext of extensions) {
            console.log(ext);
        }
    }

    static async #update(time) {
        const deltaTime = time - this.#lastTime;
        this.#lastTime = time;

        if (this.onUpdate != null) {
            await this.onUpdate(deltaTime / 1000.0);
        }

        Scene.__update();
        Keyboard.__update();
        Cursor.__update();
    }

    static async #render() {
        await Renderer.__render();

        const gl = this.#ctx;
        const error = gl.getError();

        if (error != 0) {
            throw new Error(`OpenGL error ${error}`);
        }
    }

    static async #callback(time) {
        await Aquanore.#update(time);
        await Aquanore.#render();

        requestAnimationFrame(Aquanore.#callback);
    }
}
