import { Color } from "./color";
import { LightType } from "./enums";
import { Vector3 } from "./vector3";

export class Light {
    private _type: LightType;
    private _source: Vector3;
    private _color: Color;
    private _enabled: boolean;

    get type(): LightType {
        return this._type;
    }

    set type(value: LightType) {
        this._type = value;
    }

    get source(): Vector3 {
        return this._source;
    }

    set source(value: Vector3) {
        this._source = value;
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    constructor(type: LightType) {
        this._type = type;
        this._source = new Vector3(0.5, 0.5, 0.5);
        this._color = new Color(255, 255, 255);
        this._enabled = true;
    }
}