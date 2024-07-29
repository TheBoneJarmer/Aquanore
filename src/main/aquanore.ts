import {Keyboard} from "./keyboard";
import {Shaders} from "./shaders";
import {Renderer} from "./renderer";

export class Aquanore {
    private static _ctx: WebGL2RenderingContext = null;
    private static _canvas: HTMLCanvasElement = null;
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

    private constructor() {

    }

    public static init() {
        this.initCanvas();
        this.initListeners();

        Keyboard.init();
        Shaders.init();
        Renderer.init();
    }

    private static initCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._ctx = this._canvas.getContext("webgl2");

        document.body.appendChild(this._canvas);
    }

    private static initListeners() {
        window.addEventListener("resize", (e) => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
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