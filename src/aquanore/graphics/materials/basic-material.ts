import { Color } from "../color";
import { Material } from "./material";

export class BasicMaterial extends Material {
    private _color: Color;

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
    }

    constructor() {
        super();
        this._color = new Color(255, 255, 255);
    }
}