export class Vector2 {
    static readonly ZERO: Vector2;
    static readonly ONE: Vector2;

    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);

    constructor(x?: number, y?: number);

    clone(): Vector2;

    static distance(v1: Vector2, v2: Vector2): number;
    static angle(v1: Vector2, v2: Vector2): number;
    static add(v1: Vector2, v2: Vector2): Vector2;
    static sub(v1: Vector2, v2: Vector2): Vector2;
    static mult(v1: Vector2, v2: Vector2): Vector2;
    static div(v1: Vector2, v2: Vector2): Vector2;
}