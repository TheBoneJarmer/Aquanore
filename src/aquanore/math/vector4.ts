import { Matrix4 } from "./matrix4";

export class Vector4 {
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    /**
     * The x value
     * @return {number}
     */
    get x(): number {
        return this._x;
    }

    /**
     * Sets the x value
     * @param {number} value
     */
    set x(value: number) {
        this._x = value;
    }

    /**
     * The y value
     * @return {number}
     */
    get y(): number {
        return this._y;
    }

    /**
     * Sets the y value
     * @param {number} value
     */
    set y(value: number) {
        this._y = value;
    }

    /**
     * The z value
     * @return {number}
     */
    get z(): number {
        return this._z;
    }

    /**
     * Sets the z value
     * @param {number} value
     */
    set z(value: number) {
        this._z = value;
    }

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = value;
    }

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Returns a new Vector4 instance with the values from this Vector4 instance.
     * @returns {Vector4}
     */
    clone(): Vector4 {
        return new Vector4(this._x, this._y, this._z, this._w);
    }

    toString(): string {
        return `${this._x},${this._y},${this._z},${this._w}`;
    }

    /**
     * Calculates the length of the vector
     * @param {Vector4} v 
     * @returns {number}
     */
    static length(v: Vector4): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
    }

    /**
     * Normalizes the vector and returns the result
     * @param {Vector4} v 
     * @returns {Vector4}
     */
    static normalized(v: Vector4): Vector4 {
        const scalar = 1 / this.length(v);

        if (isFinite(scalar)) {
            return new Vector4(v.x * scalar, v.y * scalar, v.z * scalar, v.w * scalar);
        }

        return new Vector4();
    }

    static floor(v: Vector4): Vector4 {
        return new Vector4(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z), Math.floor(v.w));
    }

    static ceil(v: Vector4): Vector4 {
        return new Vector4(Math.ceil(v.x), Math.ceil(v.y), Math.floor(v.z), Math.floor(v.w));
    }

    static round(v: Vector4): Vector4 {
        return new Vector4(Math.round(v.x), Math.round(v.y), Math.round(v.z), Math.round(v.w));
    }

    /* BASIC MATH */
    static add(v: Vector4, value: Vector4 | number): Vector4 {
        if (value instanceof Vector4) {
            return new Vector4(v.x + value.x, v.y + value.y, v.z + value.z, v.w + value.w);
        } else {
            return new Vector4(v.x + value, v.y + value, v.z + value, v.w + value);
        }
    }

    static sub(v: Vector4, value: Vector4 | number): Vector4 {
        if (value instanceof Vector4) {
            return new Vector4(v.x - value.x, v.y - value.y, v.z - value.z, v.w - value.w);
        } else {
            return new Vector4(v.x - value, v.y - value, v.z - value, v.w - value);
        }
    }

    static mult(v: Vector4, value: Vector4 | Matrix4 | number): Vector4 {
        if (value instanceof Vector4) {
            return new Vector4(v.x * value.x, v.y * value.y, v.z * value.z, v.w * value.w);
        } else if (value instanceof Matrix4) {
            let result = new Vector4();
            result.x = v.x * value.x1 + v.y * value.x2 + v.z * value.x3 + v.w * value.x4;
            result.y = v.x * value.y1 + v.y * value.y2 + v.z * value.y3 + v.w * value.y4;
            result.z = v.x * value.z1 + v.y * value.z2 + v.z * value.z3 + v.w * value.z4;
            result.w = v.x * value.w1 + v.y * value.w2 + v.z * value.w3 + v.w * value.w4;

            return result;
        } else {
            return new Vector4(v.x * value, v.y * value, v.z * value, v.w * value);
        }
    }

    static div(v: Vector4, value: Vector4 | number): Vector4 {
        if (value instanceof Vector4) {
            return new Vector4(v.x / value.x, v.y / value.y, v.z / value.z, v.w / value.w);
        } else {
            return new Vector4(v.x / value, v.y / value, v.z / value, v.w / value);
        }
    }
}