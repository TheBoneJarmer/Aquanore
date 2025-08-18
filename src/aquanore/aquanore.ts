import { Keyboard } from "./keyboard";
import { Shaders } from "./shaders";
import { Renderer } from "./renderer";
import { Cursor } from "./cursor";
import { Color } from "./color";
import { Joystick } from "./joystick";

export class AquanoreOptions {
    public autoResize: boolean = true;
    public width: number = window.innerWidth;
    public height: number = window.innerHeight;
}

export class Aquanore {
    private static _ctx: WebGL2RenderingContext = null;
    private static _canvas: HTMLCanvasElement = null;
    private static _options: AquanoreOptions = null;
    private static _lastTime: number = 0;

    public static get ctx() {
        if (this._ctx == null) {
            this._ctx = this._canvas.getContext("webgl2");
        }

        return this._ctx;
    }

    public static get canvas() {
        return this._canvas;
    }

    public static onUpdate: Function = null;
    public static onRender2D: Function = null;
    public static onRender3D: Function = null;
    public static onLoad: Function = null;
    public static onResize: Function = null;
    public static clearColor: Color = new Color(0, 0, 0, 255);

    private constructor() {

    }

    public static init(options?: AquanoreOptions) {
        this._options = new AquanoreOptions();

        if (options != undefined) {
            this._options = options;
        }

        this.initCanvas();
        this.initListeners();

        Keyboard.init();
        Shaders.init();
        Renderer.init();
        Cursor.init();
        Joystick.init();
    }

    private static initCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.style.touchAction = "none";
        this._canvas.width = this._options.width;
        this._canvas.height = this._options.height;

        document.body.appendChild(this._canvas);
    }

    private static initListeners() {
        window.addEventListener("resize", (e) => {
            if (this._options.autoResize) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }

            if (this.onResize != null) {
                this.onResize(window.innerWidth, window.innerHeight);
            }
        });
    }

    public static async run() {
        this._lastTime = 0;

        if (this.onLoad != null) {
            await this.onLoad();
        }

        this.callback(0);
    }

    private static async update(time: number) {
        const deltaTime = time - this._lastTime;
        this._lastTime = time;

        if (this.onUpdate != null) {
            await this.onUpdate(deltaTime / 1000.0);
        }

        Keyboard.update();
        Cursor.update();
        Joystick.update();
    }

    private static async render() {
        const gl = this.ctx
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
    }

    private static async callback(time: number) {
        await Aquanore.update(time);
        await Aquanore.render();

        requestAnimationFrame(Aquanore.callback);
    }
}
