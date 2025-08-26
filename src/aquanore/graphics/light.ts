import { Color } from "./color";
import { LightType } from "../enums";
import { Vector3 } from "../math";

export class Light {
    private _type: LightType;
    private _source: Vector3;
    private _color: Color;
    private _enabled: boolean;
    private _strength: number;
    private _range: number;

    public get type(): LightType {
        return this._type;
    }

    public set type(value: LightType) {
        this._type = value;
    }

    public get source(): Vector3 {
        return this._source;
    }

    public set source(value: Vector3) {
        this._source = value;
    }

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    public get range(): number {
        return this._range;
    }

    public set range(value: number) {
        this._range = value;
    }

    public get strength(): number {
        return this._strength;
    }

    public set strength(value: number) {
        this._strength = value;
    }

    constructor(type: LightType) {
        this._type = type;
        this._source = new Vector3(1,1,1);
        this._color = new Color(255, 255, 255);
        this._enabled = true;
        this._strength = 1;
        this._range = 10;
    }
}