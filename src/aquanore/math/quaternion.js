export class Quaternion {
    #x = 0;
    #y = 0;
    #z = 0;
    #w = 1;

    static get EPSILON() {
        return 0.00001;
    }

    static get ONE() {
        return new Quaternion(1, 1, 1, 1);
    }

    static get ZERO() {
        return new Quaternion(0, 0, 0, 1);
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

    get w() {
        return this.#w;
    }

    set w(value) {
        this.#w = value;
    }

    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#w = w;
    }

    clone() {
        return new Quaternion(this.#x, this.#y, this.#z, this.#w);
    }

    static length(q) {
        return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    }

    static normalized(q) {
        const length = this.length(q);

        if (length < this.EPSILON) {
            return Quaternion.ZERO;
        }

        const scalar = 1 / length;
        return new Quaternion(q.x * scalar, q.y * scalar, q.z * scalar, q.w * scalar);
    }

    static inversed(q) {
        return new Quaternion(q.x * -1, q.y * -1, q.z * -1, q.w);
    }
}