import { IClonable } from "../interfaces/clonable";

export class Quaternion implements IClonable<Quaternion> {
    public static readonly EPSILON = 0.00001;
    public static readonly ONE = new Quaternion(1, 1, 1, 1);
    public static readonly ZERO = new Quaternion(0, 0, 0, 1);

    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

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

    public clone(): Quaternion {
        return new Quaternion(this._x, this._y, this._z, this._w);
    }

    public static length(q: Quaternion): number {
        return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    }

    public static normalized(q: Quaternion): Quaternion {
        const length = this.length(q);

        if (length < this.EPSILON) {
            return Quaternion.ZERO;
        }

        const scalar = 1 / length;
        return new Quaternion(q.x * scalar, q.y * scalar, q.z * scalar, q.w * scalar);
    }

    public static inversed(q: Quaternion): Quaternion {
        return new Quaternion(q.x * -1, q.y * -1, q.z * -1, q.w);
    }
}