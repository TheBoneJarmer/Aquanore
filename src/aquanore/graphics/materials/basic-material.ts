import { Color } from "../color";
import { IMaterial } from "../../interfaces"

export class BasicMaterial implements IMaterial {
    private _color: Color;

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
    }

    constructor() {
        this._color = new Color(255, 255, 255);
    }
}