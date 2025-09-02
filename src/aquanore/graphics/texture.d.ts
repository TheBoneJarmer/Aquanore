export type TextureData = HTMLImageElement | ImageData | ImageBitmap | Uint8Array | Uint16Array | Uint32Array;

export class Texture {
    get id(): WebGLTexture;
    get width(): number;
    get height(): number;

    constructor(width: number, height: number, data: TextureData);
}