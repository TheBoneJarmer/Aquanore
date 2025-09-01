import { Polygon } from "./polygon";

export class Sprite {
    #poly = null;
    #tex = null;
    #frameWidth = 0;
    #frameHeight = 0;

    get poly() {
        return this.#poly;
    }

    get tex() {
        return this.#tex;
    }

    get width() {
        return this.#tex.width;
    }

    get height() {
        return this.#tex.height;
    }

    get frameWidth() {
        return this.#frameWidth;
    }

    get frameHeight() {
        return this.#frameHeight;
    }

    get framesHor() {
        if (!this.width) {
            return 0;
        }

        return this.width / this.frameWidth;
    }

    get framesVert() {
        if (!this.height) {
            return 0;
        }

        return this.height / this.frameHeight;
    }

    constructor(tex, frameWidth, frameHeight) {
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

        this.#frameWidth = frameWidth;
        this.#frameHeight = frameHeight;
        this.#tex = tex;
        this.#poly = new Polygon(vertices, texcoords);
    }
}