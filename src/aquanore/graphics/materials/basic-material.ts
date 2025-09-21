import { IMaterial } from "../../interfaces";
import { Color } from "../color";

export class BasicMaterial implements IMaterial {
    private _color: Color;

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    constructor() {       
        this._color = new Color(255, 255, 255);
    }
}