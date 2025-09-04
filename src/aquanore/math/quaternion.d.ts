import { Vector3 } from "./vector3";

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

    static toEuler(q: Quaternion): Vector3;
    static fromEuler(v: Vector3): Quaternion;
    static length(q: Quaternion): number;
    static normalized(q: Quaternion): Quaternion;
    static inversed(q: Quaternion): Quaternion;
    static slerp(q1: Quaternion, q1: Quaternion, t: number): Quaternion;
    static dot(q1: Quaternion, q2: Quaternion): number;
    static add(q1: Quaternion, q2: Quaternion): Quaternion;
    static sub(q1: Quaternion, q2: Quaternion): Quaternion;
    static mult(q1: Quaternion, q2: Quaternion): Quaternion;
}