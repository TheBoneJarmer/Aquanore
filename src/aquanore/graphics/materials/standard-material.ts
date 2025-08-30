import { IMaterial } from "../../interfaces";
import { Color } from "../color";
import { Texture } from "../texture";

export class StandardMaterial implements IMaterial {
    private _ambient: Color;
    private _color: Color;
    private _colorMap: Texture;
    private _normalMap: Texture;

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
    }

    public get colorMap(): Texture {
        return this._colorMap;
    }

    public set colorMap(value: Texture) {
        this._colorMap = value;
    }

    public get normalMap(): Texture {
        return this._normalMap;
    }

    public set normalMap(value: Texture) {
        this._normalMap = value;
    }

    public get ambient(): Color {
        return this._ambient;
    }

    public set ambient(value: Color) {
        this._ambient = value;
    }

    constructor() {       
        this._color = new Color(255, 255, 255);
        this._ambient = new Color(55, 55, 55);
        this._colorMap = null;
        this._normalMap = null;
    }
}