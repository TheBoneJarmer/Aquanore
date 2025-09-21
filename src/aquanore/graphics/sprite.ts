import { Texture } from ".";
import { Polygon } from "./polygon";

export class Sprite {
    private _poly: Polygon;
    private _tex: Texture;
    private _frameWidth: number;
    private _frameHeight: number

    get poly(): Polygon {
        return this._poly;
    }

    get tex(): Texture {
        return this._tex;
    }

    get width(): number {
        return this._tex.width;
    }

    get height(): number {
        return this._tex.height;
    }

    get frameWidth(): number {
        return this._frameWidth;
    }

    get frameHeight(): number {
        return this._frameHeight;
    }

    get framesHor(): number {
        if (!this.width) {
            return 0;
        }

        return this.width / this.frameWidth;
    }

    get framesVert(): number {
        if (!this.height) {
            return 0;
        }

        return this.height / this.frameHeight;
    }

    constructor(tex: Texture, frameWidth: number, frameHeight: number) {
        const tcX = 1.0 / (tex.width / frameWidth);
        const tcY = 1.0 / (tex.height / frameHeight);
        const vertices = [
            0, 0,
            frameWidth, 0,
            0, frameHeight,
            frameWidth, 0,
            0, frameHeight,
            frameWidth, frameHeight
        ];

        const texcoords = [
            0, 0,
            tcX, 0,
            0, tcY,
            tcX, 0,
            0, tcY,
            tcX, tcY
        ];

        this._frameWidth = frameWidth;
        this._frameHeight = frameHeight;
        this._tex = tex;
        this._poly = new Polygon(vertices, texcoords);
    }
}