import { IMaterial } from "../../interfaces";
import { Color } from "../color";
import { Texture } from "../texture";

export class StandardMaterial implements IMaterial {
    private _ambient: Color;
    private _color: Color;
    private _colorMap: Texture | null;
    private _normalMap: Texture | null;
    private _castShadow: boolean;
    private _receiveShadow: boolean;

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    get colorMap(): Texture | null {
        return this._colorMap;
    }

    set colorMap(value: Texture | null) {
        this._colorMap = value;
    }

    get normalMap(): Texture | null {
        return this._normalMap;
    }

    set normalMap(value: Texture | null) {
        this._normalMap = value;
    }

    get ambient(): Color {
        return this._ambient;
    }

    set ambient(value: Color) {
        this._ambient = value;
    }

    get castShadow(): boolean {
        return this._castShadow;
    }

    set castShadow(value: boolean) {
        this._castShadow = value;
    }

    get receiveShadow(): boolean {
        return this._receiveShadow;
    }

    set receiveShadow(value: boolean) {
        this._receiveShadow = value;
    }

    constructor() {              
        this._color = new Color(255, 255, 255);
        this._ambient = new Color(100, 100, 100);
        this._colorMap = null;
        this._normalMap = null;
        this._castShadow = true;
        this._receiveShadow = true;
    }
}