import { IClonable } from "./interfaces/iclonable";

export class Vector3 implements IClonable<Vector3> {
    public static readonly ZERO = new Vector3(0, 0, 0);
    public static readonly ONE = new Vector3(1, 1, 1);

    private _x: number;
    private _y: number;
    private _z: number;

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get z(): number {
        return this._z;
    }

    set z(value: number) {
        this._z = value;
    }

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public clone(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    public static length(v: Vector3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    public static normalized(v: Vector3): Vector3 {
        const scalar = 1 / this.length(v);

        if (isFinite(scalar)) {
            return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
        }

        return new Vector3();
    }

    public static cross(v1: Vector3, v2: Vector3) {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = -(v1.x * v2.z - v1.z * v2.x);
        const z = v1.x * v2.y - v1.y * v2.x;

        return new Vector3(x, y, z);
    }

    public static dot(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /* BASIC MATH */
    public static add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.y);
    }

    public static sub(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static mult(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    public static div(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
}