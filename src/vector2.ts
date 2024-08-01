export class Vector2 {
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

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public static distance(v1: Vector2, v2: Vector2): number {
        let x = v1.x - v2.y;
        let y = v1.y - v2.y;

        return Math.sqrt((x * x) + (y * y));
    }

    public static angle(v1: Vector2, v2: Vector2): number {
        let theta = Math.atan2(v2.y - v1.y, v2.x - v1.x);

        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return theta;
    }
}