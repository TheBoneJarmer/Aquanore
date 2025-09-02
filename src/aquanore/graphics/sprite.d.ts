import { Polygon } from "./polygon";
import { Texture } from "./texture";

export class Sprite {
    get poly(): Polygon;
    get tex(): Texture;
    get width(): number;
    get height(): number;
    get frameWidth(): number;
    get frameHeight(): number;
    get framesHor(): number;
    get framesVert(): number;

    constructor(tex: Texture, frameWidth: number, frameHeight: number);
}