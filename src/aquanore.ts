import {Keyboard} from "./keyboard";
import {Shaders} from "./shaders";
import {Renderer} from "./renderer";
import {Cursor} from "./cursor";

export class AquanoreOptions {
    public autoResize: boolean = true;
    public width: number = window.innerWidth;
    public height: number = window.innerHeight;
}

export class Aquanore {
    private static _ctx: WebGL2RenderingContext | null = null;
    private static _canvas: HTMLCanvasElement | null = null;
    private static _options: AquanoreOptions | null = null;
    private static _lastTime: number = 0;

    public static get ctx() {
        return this._ctx;
    }

    public static get canvas() {
        return this._canvas;
    }

    public static onUpdate: Function | null = null;
    public static onRender: Function | null = null;
    public static onLoad: Function | null = null;
    public static onResize: Function | null = null;

    private constructor() {

    }

    public static init(options: AquanoreOptions) {
        this._options = options;

        this.initCanvas();
        this.initListeners();

        Keyboard.init();
        Shaders.init();
        Renderer.init();
        Cursor.init();
    }

    private static initCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._options!.width;
        this._canvas.height = this._options!.height;
        document.body.appendChild(this._canvas);

        this._ctx = this._canvas.getContext("webgl2");
    }

    private static initListeners() {
        window.addEventListener("resize", (e) => {
            if (this._options!.autoResize) {
                this._canvas!.width = window.innerWidth;
                this._canvas!.height = window.innerHeight;
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
            await this.onUpdate(deltaTime);
        }

        Keyboard.update();
        Cursor.update();
    }

    private static async render() {
        const gl = this._ctx!
        const ctx = this._canvas!;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, ctx.width, ctx.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (this.onRender != null) {
            await this.onRender();
        }
    }

    private static async callback(time: number) {
        await Aquanore.update(time);
        await Aquanore.render();

        requestAnimationFrame(Aquanore.callback);
    }
}
