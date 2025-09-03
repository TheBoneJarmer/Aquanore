export class Vector3 {
    #x = 0;
    #y = 0;
    #z = 0;

    static get ZERO() {
        return new Vector3(0, 0, 0);
    }

    static get ONE() {
        return new Vector3(1, 1, 1);
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

    get z() {
        return this.#z;
    }

    set z(value) {
        this.#z = value;
    }

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vector3(this.#x, this.#y, this.#z);
    }

    static length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    static normalized(v) {
        const scalar = 1 / this.length(v);

        if (isFinite(scalar)) {
            return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
        }

        return new Vector3();
    }

    static cross(v1, v2) {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = -(v1.x * v2.z - v1.z * v2.x);
        const z = v1.x * v2.y - v1.y * v2.x;

        return new Vector3(x, y, z);
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /* BASIC MATH */
    static add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    static sub(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static mult(v1, v2) {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    static div(v1, v2) {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
}