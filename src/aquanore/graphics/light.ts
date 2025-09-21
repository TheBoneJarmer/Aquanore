import { Color } from "./color";
import { Vector3 } from "../math";
import { LightType } from "../enums";

export class Light {
    private _type: LightType;
    private _source: Vector3;
    private _color: Color;
    private _enabled: boolean;
    private _strength: number;
    private _range: number;

    /**
     * Returns the light type
     * @return {LightType}
     */
    get type(): LightType {
        return this._type;
    }

    /**
     * Set the light type
     * @param {LightType} value
     */
    set type(value: LightType) {
        this._type = value;
    }

    /**
     * Returns the light source
     * @return {Vector3}
     */
    get source(): Vector3 {
        return this._source;
    }

    /**
     * Sets the light source
     * @param {Vector3} value
     */
    set source(value: Vector3) {
        this._source = value;
    }

    /**
     * Returns the light color
     * @return {Color}
     */
    get color(): Color {
        return this._color;
    }

    /**
     * Sets the light color
     * @param {Color} value
     */
    set color(value: Color) {
        this._color = value;
    }

    /**
     * Returns true if the light is enabled or false if it isn't
     * @return {boolean}
     */
    get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Enables or disables the light
     * @param {boolean} value
     */
    set enabled(value: boolean) {
        this._enabled = value;
    }

    /**
     * Returns the light range. For non-directional lights only.
     * @return {number}
     */
    get range(): number {
        return this._range;
    }

    /**
     * Sets the light range. The value be larger than 0. For non-directional lights only.
     * @param {number} value
     */
    set range(value: number) {
        if (value <= 0) {
            throw new Error("Light range must be higher than 0");
        }

        this._range = value;
    }

    /**
     * Returns the light's strength. For non-directional lights only.
     * @returns {number}
     */
    get strength(): number {
        return this._strength;
    }

    /**
     * Sets the light strength. The value be larger than 0. For non-directional lights only.
     */
    set strength(value: number) {
        if (value <= 0) {
            throw new Error("Light strength must be higher than 0");
        }

        this._strength = value;
    }

    constructor(type: LightType) {
        this._type = type;
        this._source = new Vector3(1, 1, 1);
        this._color = new Color(255, 255, 255);
        this._enabled = true;
        this._strength = 1;
        this._range = 10;
    }
}