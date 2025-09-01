export class Quaternion {
    static readonly EPSILON: number;
    static readonly ONE: Quaternion;
    static readonly ZERO: Quaternion;

    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);

    constructor(x?: number, y?: number, z?: number, w?: number);

    clone(): Quaternion;

    static length(q: Quaternion): number;
    static normalized(q: Quaternion): Quaternion;
    static inversed(q: Quaternion): Quaternion;
}