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
    private static _onUpdate: Function | null;
    private static _onRender2D: Function | null;
    private static _onRender3D: Function | null;
    private static _onLoad: Function | null;
    private static _onResize: Function | null;

    /**
     * Returns the WebGL context from the canvas
     * @returns {WebGL2RenderingContext}
     */
    static get ctx(): WebGL2RenderingContext {
        if (this._ctx == null) {
            this._ctx = this._canvas.getContext("webgl2")!;
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
     * Returns the options used during initialization. Please do not modify the options after initialization or you'll fuck something up.
     * @returns {AquanoreOptions}
     */
    static get options(): AquanoreOptions {
        return this._options;
    }

    /**
     * Gets the function to be called on each update.
     * @returns {Function}
     */
    static get onUpdate(): Function | null {
        return this._onUpdate;
    }

    /**
     * Sets the function to be called on each update.
     * @param {Function} callback
     */
    static set onUpdate(callback: Function) {
        this._onUpdate = callback;
    }

    /**
     * Gets the function to be called for 2D rendering.
     * @returns {Function}
     */
    static get onRender2D(): Function | null {
        return this._onRender2D;
    }

    /**
     * Sets the function to be called for 2D rendering.
     * @param {Function} callback
     */
    static set onRender2D(callback: Function) {
        this._onRender2D = callback;
    }

    /**
     * Gets the function to be called for 3D rendering.
     * @returns {Function}
     */
    static get onRender3D(): Function | null {
        return this._onRender3D;
    }

    /**
     * Sets the function to be called for 3D rendering.
     * @param {Function} callback
     */
    static set onRender3D(callback: Function) {
        this._onRender3D = callback;
    }

    /**
     * Gets the function to be called on load.
     * @returns {Function}
     */
    static get onLoad(): Function | null {
        return this._onLoad;
    }

    /**
     * Sets the function to be called on load.
     * @param {Function} callback
     */
    static set onLoad(callback: Function) {
        this._onLoad = callback;
    }

    /**
     * Gets the function to be called on resize.
     * @returns {Function}
     */
    static get onResize(): Function | null {
        return this._onResize;
    }

    /**
     * Sets the function to be called on resize.
     * @param {Function} callback
     */
    static set onResize(callback: Function) {
        this._onResize = callback;
    }

    /**
     * Initializes Aquanore. This **must** be ran before doing anything else.
     * @param {AquanoreOptions} options (Optional) Initializes aquanore with a configuration
     */
    static async init(options: AquanoreOptions = new AquanoreOptions()) {
        this._options = options;
        this._lastTime = 0;

        this.initCanvas();
        this.initListeners();

        // Run all init methods from the static classes
        await Keyboard.__init();
        await Shaders.__init();
        await Cursor.__init();
        await Joystick.__init();
        await Renderer.__init();
        await Scene.__init();
        await Audio.__init();
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

            if (this._onResize != null) {
                this._onResize(window.innerWidth, window.innerHeight);
            }

            await Renderer.__resize();
        });
    }

    /**
     * Starts the main loop
     */
    static async run() {
        this._lastTime = 0;

        if (this._onLoad != null) {
            await this._onLoad();
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

        for (let ext of extensions ?? []) {
            console.log(ext);
        }
    }

    private static async update(time: number) {
        const deltaTime = time - this._lastTime;
        this._lastTime = time;

        if (this._onUpdate != null) {
            await this._onUpdate(deltaTime / 1000.0);
        }

        await Scene.__update();
        await Keyboard.__update();
        await Cursor.__update();
    }

    private static async render() {
        await Renderer.__render();

        const gl = this._ctx;
        const errNum = gl.getError();

        if (errNum != 0) {
            let errStr = `${errNum}`;

            if (errNum == gl.INVALID_ENUM) errStr = "INVALID_ENUM";
            if (errNum == gl.INVALID_VALUE) errStr = "INVALID_VALUE";
            if (errNum == gl.INVALID_OPERATION) errStr = "INVALID_OPERATION";
            if (errNum == gl.OUT_OF_MEMORY) errStr = "OUT_OF_MEMORY";
            if (errNum == gl.INVALID_FRAMEBUFFER_OPERATION) errStr = "INVALID_FRAMEBUFFER_OPERATION";
            if (errNum == gl.CONTEXT_LOST_WEBGL) errStr = "CONTEXT_LOST";

            throw new Error(`WebGL ${errStr}`);
        }
    }

    private static async callback(time: number) {
        await Aquanore.update(time);
        await Aquanore.render();

        requestAnimationFrame(Aquanore.callback);
    }
}
