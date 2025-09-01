export class Vector2 {
    #x = 0;
    #y = 0;

    static get ZERO() {
        return new Vector2(0, 0);
    }

    static get ONE() {
        return new Vector2(1, 1);
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
    }

    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
    }

    clone() {
        return new Vector2(this.#x, this.#y);
    }

    static distance(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;

        return Math.sqrt((x * x) + (y * y));
    }

    static angle(v1, v2) {
        let theta = Math.atan2(v2.y - v1.y, v2.x - v1.x);

        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return theta;
    }

    /* BASIC MATH */
    static add(v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y,);
    }

    static sub(v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static mult(v1, v2) {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    static div(v1, v2) {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }
}
