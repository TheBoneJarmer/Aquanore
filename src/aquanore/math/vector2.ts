export class Vector2 {
    static readonly ZERO = new Vector2(0, 0);
    static readonly ONE = new Vector2(1, 1);

    private _x: number;
    private _y: number;

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

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    clone(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    static distance(v1: Vector2, v2: Vector2): number {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;

        return Math.sqrt((x * x) + (y * y));
    }

    static angle(v1: Vector2, v2: Vector2): number {
        let theta = Math.atan2(v2.y - v1.y, v2.x - v1.x);

        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return theta;
    }

    /* BASIC MATH */
    static add(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x + v2.x, v1.y + v2.y,);
    }

    static sub(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static mult(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    static div(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }
}
