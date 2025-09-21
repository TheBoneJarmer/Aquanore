import { Renderer } from "./graphics/renderer";
import { Scene } from "./graphics";
import { Shaders } from "./graphics/shaders";
import { Joystick, Keyboard, Cursor } from "./input";
import { AquanoreOptions } from "./aquanore-options";
import { Audio } from "./audio";

export class Aquanore {
    private static _ctx: WebGL2RenderingContext;
    private static _canvas: HTMLCanvasElement;
    private static _options: AquanoreOptions;
    private static _lastTime: number;

    /**
     * Returns the WebGL context from the canvas
     * @returns {WebGL2RenderingContext}
     */
    static get ctx(): WebGL2RenderingContext {
        if (this._ctx == null) {
            this._ctx = this._canvas.getContext("webgl2");
        }

        return this._ctx;
    }

    /**
     * Returns the HTML canvas element
     * @returns {HTMLCanvasElement}
     */
    static get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    /**
     * Returns the options
     * @returns {AquanoreOptions}
     */
    static get options(): AquanoreOptions {
        return this._options;
    }

    static onUpdate: Function = null;
    static onRender2D: Function = null;
    static onRender3D: Function = null;
    static onLoad: Function = null;
    static onResize: Function = null;

    /**
     * Initializes Aquanore. This **must** be ran before doing anything else.
     * @param {AquanoreOptions} options (Optional) Initializes aquanore with a configuration
     */
    static init(options = new AquanoreOptions()) {
        this._options = options;
        this._lastTime = 0;

        this.initCanvas();
        this.initListeners();

        // Run all init methods from the static classes
        Keyboard.__init();
        Shaders.__init();
        Cursor.__init();
        Joystick.__init();
        Renderer.__init();
        Scene.__init();
        Audio.__init();
    }

    private static initCanvas() {
        if (this._options.canvas.dom == null) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            document.body.appendChild(this._canvas);
        } else {
            this._canvas = this._options.canvas.dom;
        }

        this._canvas.style.touchAction = "none";
    }

    private static initListeners() {
        window.addEventListener("resize", async (e) => {
            if (this._options.canvas.autoResize) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }

            if (this.onResize != null) {
                this.onResize(window.innerWidth, window.innerHeight);
            }

            await Renderer.__resize();
        });
    }

    /**
     * Starts the main loop
     */
    static async run() {
        this._lastTime = 0;

        if (this.onLoad != null) {
            await this.onLoad();
        }

        this.callback(0);
    }

    /**
     * Log WebGL related info
     */
    static info() {
        const gl = this._ctx;
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

    private static async update(time) {
        const deltaTime = time - this._lastTime;
        this._lastTime = time;

        if (this.onUpdate != null) {
            await this.onUpdate(deltaTime / 1000.0);
        }

        Scene.__update();
        Keyboard.__update();
        Cursor.__update();
    }

    private static async render() {
        await Renderer.__render();

        const gl = this._ctx;
        const error = gl.getError();

        if (error != 0) {
            throw new Error(`OpenGL error ${error}`);
        }
    }

    private static async callback(time) {
        await Aquanore.update(time);
        await Aquanore.render();

        requestAnimationFrame(Aquanore.callback);
    }
}
