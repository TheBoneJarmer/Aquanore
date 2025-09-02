import { Color } from "../color";
import { Material } from "./material";

export class BasicMaterial extends Material {
    get color(): Color;
    set color(value: Color);

    constructor();
}