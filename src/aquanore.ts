import {Keyboard, Keys} from "./keyboard";
import {Shaders} from "./shaders";
import {Renderer} from "./renderer";
import {Cursor} from "./cursor";

export class AquanoreOptions {
    public autoResize: boolean = true;
    public width: number = window.innerWidth;
    public height: number = window.innerHeight;
}

export class Aquanore {
    private static _ctx: WebGL2RenderingContext = null;
    private static _canvas: HTMLCanvasElement = null;
    private static _options: AquanoreOptions = null;
    private static _lastTime: number;

    public static get ctx() {
        return this._ctx;
    }

    public static get canvas() {
        return this._canvas;
    }

    public static onUpdate: Function = null;
    public static onRender: Function = null;
    public static onLoad: Function = null;
    public static onResize: Function = null;

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
        this._canvas.width = this._options.width;
        this._canvas.height = this._options.height;
        document.body.appendChild(this._canvas);

        this._ctx = this._canvas.getContext("webgl2");
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

    public static run() {
        this._lastTime = 0;

        if (this.onLoad != null) {
            this.onLoad();
        }

        this.callback(0);
    }

    private static update(time: number) {
        const deltaTime = time - this._lastTime;
        this._lastTime = time;

        if (this.onUpdate != null) {
            this.onUpdate(deltaTime);
        }

        Keyboard.update();
        Cursor.update();
    }

    private static render() {
        const gl = this._ctx;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (this.onRender != null) {
            this.onRender();
        }
    }

    private static callback(time: number) {
        Aquanore.update(time);
        Aquanore.render();

        requestAnimationFrame(Aquanore.callback);
    }
}