export class Vector3 {
    static readonly ZERO: Vector3;
    static readonly ONE: Vector3;

    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);

    constructor(x?: number, y?: number, z?: number);

    clone(): Vector3;

    static length(v: Vector3): number;
    static normalized(v: Vector3): Vector3;
    static cross(v1: Vector3, v2: Vector3): Vector3;
    static dot(v1: Vector3, v2: Vector3): number;
    static lerp(v1: Vector3, v2: Vector3, t: number): Vector3;
    static add(v1: Vector3, v2: Vector3): Vector3;
    static sub(v1: Vector3, v2: Vector3): Vector3;
    static mult(v1: Vector3, v2: Vector3): Vector3;
    static div(v1: Vector3, v2: Vector3): Vector3;
}