import {Polygon} from "./polygon";
import {Texture} from "./texture";

export class Sprite {
    private _poly: Polygon | null = null;
    private _tex: Texture | null = null;
    private _frameWidth: number = 0;
    private _frameHeight: number = 0;

    get poly(): Polygon | null {
        return this._poly;
    }

    get tex(): Texture | null {
        return this._tex;
    }

    public get width(): number | undefined {
        return this._tex?.width;
    }

    public get height(): number | undefined {
        return this._tex?.height;
    }

    public get frameWidth(): number {
        return this._frameWidth;
    }

    public get frameHeight(): number {
        return this._frameHeight;
    }

    public get framesHor(): number {
        if (!this.width) {
            return 0;
        }

        return this.width / this.frameWidth;
    }

    public get framesVert(): number {
        if (!this.height) {
            return 0;
        }

        return this.height / this.frameHeight;
    }

    public constructor(path: string, frameWidth: number, frameHeight: number) {
        this._frameWidth = frameWidth;
        this._frameHeight = frameHeight;

        this._tex = new Texture(path);
        this._tex.onLoad = () => {
            this.generatePolygon();
        }
    }

    private generatePolygon() {
        const tcX = 1.0 / this.framesHor;
        const tcY = 1.0 / this.framesVert;
        const vertices = [
            0, 0,
            this._frameWidth, 0,
            0, this._frameHeight,
            this._frameWidth, 0,
            0, this._frameHeight,
            this._frameWidth, this._frameHeight
        ];

        const texcoords = [
            0, 0,
            tcX, 0,
            0, tcY,
            tcX, 0,
            0, tcY,
            tcX, tcY
        ];

        this._poly = new Polygon(vertices, texcoords);
    }
}