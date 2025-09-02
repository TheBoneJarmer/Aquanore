import { Color } from "../color";
import { Texture } from "../texture";
import { Material } from "./material";

export class StandardMaterial extends Material {
    get color(): Color;
    set color(value: Color);
    get colorMap(): Texture;
    set colorMap(value: Texture);
    get normalMap(): Texture;
    set normalMap(value: Texture);
    get ambient(): Color;
    set ambient(value: Color);

    constructor();
}