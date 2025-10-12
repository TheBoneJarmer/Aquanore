import { Aquanore } from "../aquanore";
import { ICamera } from "../interfaces";
import { Matrix4 } from "./matrix4";
import { Vector2 } from "./vector2";
import { Vector4 } from "./vector4";

export class Vector3 {
    static readonly ZERO = new Vector3(0, 0, 0);
    static readonly ONE = new Vector3(1, 1, 1);
    static readonly UP = new Vector3(0, 1, 0);
    static readonly DOWN = new Vector3(0, -1, 0);
    static readonly LEFT = new Vector3(-1, 0, 0);
    static readonly RIGHT = new Vector3(1, 0, 0);
    static readonly FORWARD = new Vector3(0, 0, 1);
    static readonly BACKWARD = new Vector3(0, 0, -1);

    private _x: number;
    private _y: number;
    private _z: number;

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

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns a new Vector3 instance with the values from this Vector3 instance.
     * @returns {Vector3}
     */
    clone(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    toString(): string {
        return `${this._x},${this._y},${this._z}`;
    }

    /**
     * Calculates the length of the vector
     * @param {Vector3} v 
     * @returns {number}
     */
    static length(v: Vector3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    /**
     * Normalizes the vector and returns the result
     * @param {Vector3} v 
     * @returns {Vector3}
     */
    static normalized(v: Vector3): Vector3 {
        const scalar = 1 / this.length(v);

        if (isFinite(scalar)) {
            return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
        }

        return new Vector3();
    }

    /**
     * Calculates the cross product of vector `v1` and vector `v2`.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static cross(v1: Vector3, v2: Vector3): Vector3 {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = -(v1.x * v2.z - v1.z * v2.x);
        const z = v1.x * v2.y - v1.y * v2.x;

        return new Vector3(x, y, z);
    }

    /**
     * Calculates the cross product of vector `v1` and vector `v2`.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {number}
     */
    static dot(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Calculates the linear interpolated value of two vectors and returns it.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @param {number} t 
     * @returns {Vector3}
     */
    static lerp(v1: Vector3, v2: Vector3, t: number): Vector3 {
        const v = new Vector3();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);

        return v;
    }

    static inverse(v: Vector3): Vector3 {
        return new Vector3(-v.x, -v.y, -v.z);
    }

    /**
     * Returns the direction of the world position of the provided screen position
     * @param v The screen coordinates
     * @param cam The camera
     * @returns The direction
     */
    static unprojectDir(v: Vector2, cam: ICamera): Vector3 {
        const cnv = Aquanore.canvas;

        let ndc = new Vector2();
        ndc.x = (v.x / cnv.width) * 2 - 1;
        ndc.y = -(v.y / cnv.height) * 2 + 1;

        let clip = new Vector4(ndc.x, ndc.y, -1, 1);
        let eye = Vector4.mult(clip, Matrix4.inverse(cam.projectionMatrix));
        eye.z = -1;
        eye.w = 0;

        let world = Vector4.mult(eye, Matrix4.inverse(cam.viewMatrix));
        world = Vector4.normalized(world);

        return new Vector3(world.x, world.y, world.z);
    }

    /**
     * Returns the world position of the provided screen position
     * @param v The screen coordinates
     * @param cam The camera
     * @returns The unprojected coordinates
     */
    static unproject(v: Vector2, cam:ICamera): Vector3 {
        const cnv = Aquanore.canvas;

        let ndc = new Vector2();
        ndc.x = (v.x / cnv.width) * 2 - 1;
        ndc.y = -(v.y / cnv.height) * 2 + 1;

        let mat = Matrix4.identity();
        mat = Matrix4.multiply(mat, cam.projectionMatrix);
        mat = Matrix4.multiply(mat, cam.viewMatrix);
        mat = Matrix4.inverse(mat);

        let origin = new Vector4(ndc.x, ndc.y, -1, 1);
        origin = Vector4.mult(origin, mat);
        origin.w = 1.0 / origin.w;
        origin.x *= origin.w;
        origin.y *= origin.w;
        origin.z *= origin.w;

        return new Vector3(origin.x, origin.y, origin.z);
    }

    static floor(v: Vector3): Vector3 {
        return new Vector3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z));
    }

    static ceil(v: Vector3): Vector3 {
        return new Vector3(Math.ceil(v.x), Math.ceil(v.y), Math.floor(v.z));
    }

    static round(v: Vector3): Vector3 {
        return new Vector3(Math.round(v.x), Math.round(v.y), Math.round(v.z));
    }

    /* BASIC MATH */
    static add(v: Vector3, value: Vector3 | number): Vector3 {
        if (value instanceof Vector3) {
            return new Vector3(v.x + value.x, v.y + value.y, v.z + value.z);
        } else {
            return new Vector3(v.x + value, v.y + value, v.z + value);
        }
    }

    static sub(v: Vector3, value: Vector3 | number): Vector3 {
        if (value instanceof Vector3) {
            return new Vector3(v.x - value.x, v.y - value.y, v.z - value.z);
        } else {
            return new Vector3(v.x - value, v.y - value, v.z - value);
        }
    }

    static mult(v: Vector3, value: Vector3 | Matrix4 | number): Vector3 {
        if (value instanceof Vector3) {
            return new Vector3(v.x * value.x, v.y * value.y, v.z * value.z);
        } else if (value instanceof Matrix4) {
            const x = v.x, y = v.y, z = v.z;
            const e = value.values;
            const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

            const result = new Vector3();
            result.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
            result.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
            result.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

            return result;
        } else {
            return new Vector3(v.x * value, v.y * value, v.z * value);
        }
    }

    static div(v: Vector3, value: Vector3 | number): Vector3 {
        if (value instanceof Vector3) {
            return new Vector3(v.x / value.x, v.y / value.y, v.z / value.z);
        } else {
            return new Vector3(v.x / value, v.y / value, v.z / value);
        }
    }
}