import { AquanoreOptions } from "./aquanore-options";
import { Color } from "./graphics";

export class Aquanore {
    static get ctx(): WebGL2RenderingContext;
    static get canvas(): HTMLCanvasElement;

    static onUpdate: Function | null;
    static onRender2D: Function | null;
    static onRender3D: Function | null;
    static onLoad: Function | null;
    static onResize: Function | null;
    static clearColor: Color;

    static init(options?: AquanoreOptions): void;
    static run(): void;
}