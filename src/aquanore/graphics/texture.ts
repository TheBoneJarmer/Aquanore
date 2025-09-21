import { Aquanore } from "../aquanore";

export type TextureData = HTMLImageElement | ImageData | ImageBitmap | Uint8Array | Uint16Array | Uint32Array;

export class Texture {
    private _id: WebGLTexture;
    private _width: number;
    private _height: number;

    get id(): WebGLTexture {
        return this._id;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    constructor(width: number, height: number, data: TextureData) {
        this._width = width;
        this._height = height;

        if (data instanceof WebGLTexture) {
            this._id = data;
        } else {
            this.#generate(data);
        }
    }

    #generate(data: TextureData) {
        const gl = Aquanore.ctx;
        const id = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);

        if (data instanceof HTMLImageElement || data instanceof ImageData || data instanceof ImageBitmap) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof Uint8Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof Uint16Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_SHORT, data);
        }

        if (data instanceof Uint32Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_INT, data);
        }

        this._id = id;
    }
}