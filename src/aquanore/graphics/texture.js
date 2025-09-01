import { Aquanore } from "../aquanore";

export class Texture {
    #id = null;
    #width = 0;
    #height = 0;

    get id() {
        return this.#id;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    constructor(width, height, data) {
        const gl = Aquanore.ctx;
        const id = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        if (data instanceof HTMLImageElement || data instanceof ImageData || data instanceof ImageBitmap) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof Uint8Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof Uint16Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_SHORT, data);
        }

        if (data instanceof Uint32Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_INT, data);
        }

        this.#id = id;
        this.#width = width;
        this.#height = height;
    }
}