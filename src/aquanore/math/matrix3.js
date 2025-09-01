import { Matrix4 } from "./matrix4";

export class Matrix3 {
    #array = [];

    get x1() {
        return this.#array[0];
    }

    set x1(value) {
        this.#array[0] = value;
    }

    get y1() {
        return this.#array[1];
    }

    set y1(value) {
        this.#array[1] = value;
    }

    get z1() {
        return this.#array[2];
    }

    set z1(value) {
        this.#array[2] = value;
    }

    get x2() {
        return this.#array[3];
    }

    set x2(value) {
        this.#array[3] = value;
    }

    get y2() {
        return this.#array[4];
    }

    set y2(value) {
        this.#array[4] = value;
    }

    get z2() {
        return this.#array[5];
    }

    set z2(value) {
        this.#array[5] = value;
    }

    get x3() {
        return this.#array[6];
    }

    set x3(value) {
        this.#array[6] = value;
    }

    get y3() {
        return this.#array[7];
    }

    set y3(value) {
        this.#array[7] = value;
    }

    get z3() {
        return this.#array[8];
    }

    set z3(value) {
        this.#array[8] = value;
    }

    get values() {
        return this.#array;
    }

    set values(values) {
        this.#array = values;
    }

    constructor(values) {
        this.#array = values;
    }

    clone() {
        return new Matrix3(this.values.map(x => x));
    }

    static identity() {
        const values = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];

        return new Matrix3(values);
    }

    static from(src) {
        let values = [];

        if (src instanceof Matrix3) {
            values = src.values.map(x => x);
        }

        if (src instanceof Matrix4) {
            values = [
                src.x1, src.y1, src.z1,
                src.x2, src.y2, src.z2,
                src.x3, src.y3, src.z3
            ];
        }

        return new Matrix3(values);
    }

    static transpose(mat) {
        const x2 = mat.y1;
        const x3 = mat.z1;
        const y1 = mat.x2;
        const y3 = mat.z2;
        const z1 = mat.x3;
        const z2 = mat.y3;

        const result = mat.clone();
        result.y1 = y1;
        result.z1 = z1;
        result.x2 = x2;
        result.z2 = z2;
        result.x3 = x3;
        result.y3 = y3;

        return result;
    }

    static inverse(mat) {
        const a = mat.x1 * mat.y2 * mat.z3 + mat.y1 * mat.z2 * mat.x3 + mat.z1 * mat.x2 * mat.y3;
        const b = mat.z1 * mat.y2 * mat.x3 - mat.y1 * mat.x2 * mat.z3 - mat.x1 * mat.z2 * mat.y3;
        const detm = a - b;

        if (detm == 0) {
            return mat.clone();
        }

        const kx1 = mat.y2 * mat.z3 - mat.z2 * mat.y3;
        const kx2 = mat.x2 * mat.z3 - mat.z2 * mat.x3;
        const kx3 = mat.x2 * mat.y3 - mat.y2 * mat.x3;
        
        const ky1 = mat.y1 * mat.z3 - mat.z1 * mat.y3;
        const ky2 = mat.x1 * mat.z3 - mat.z1 * mat.x3;
        const ky3 = mat.x1 * mat.y3 - mat.y1 * mat.x3;
        
        const kz1 = mat.y1 * mat.z2 - mat.z1 * mat.y2;
        const kz2 = mat.x1 * mat.z2 - mat.z1 * mat.x2;
        const kz3 = mat.x1 * mat.y2 - mat.y1 * mat.x2;

        const q = 1 / detm;
        const result = mat.clone();
        result.x1 = q * kx1;
        result.y1 = -q * ky1;
        result.z1 = q * kz1;

        result.x2 = -q * kx2;
        result.y2 = q * ky2;
        result.z2 = -q * kz2;

        result.x3 = q * kx3;
        result.y3 = -q * ky3;
        result.z3 = q * kz3;

        return result;
    }

    /*
    rotate(angle) {
        if (angle === 0) return this;

        const d = angle * Math.PI / 180;
        const sin = Math.sin(d), cos = Math.cos(d);

        const m2a1 = cos, m2b1 = sin;
        const m2a2 = -sin, m2b2 = cos;

        const a1 = this.a1 * m2a1 + this.a2 * m2b1;
        const b1 = this.b1 * m2a1 + this.b2 * m2b1;
        const c1 = this.c1 * m2a1 + this.c2 * m2b1;

        const a2 = this.a1 * m2a2 + this.a2 * m2b2;
        const b2 = this.b1 * m2a2 + this.b2 * m2b2;
        const c2 = this.c1 * m2a2 + this.c2 * m2b2;

        this.a1 = a1; this.b1 = b1; this.c1 = c1;
        this.a2 = a2; this.b2 = b2; this.c2 = c2;

        return this;
    }

    translate(x, y) {
        this.a3 += this.a1 * x + this.a2 * y;
        this.b3 += this.b1 * x + this.b2 * y;
        this.c3 += this.c1 * x + this.c2 * y;

        return this;
    }

    scale(x, y) {
        if (x === 1 && y === 1) return this;

        this.a1 *= x; this.b1 *= x; this.c1 *= x;
        this.a2 *= y; this.b2 *= y; this.c2 *= y;

        return this;
    }

    inverse() {
        const detM
            = this.a1 * this.b2 * this.c3 + this.b1 * this.c2 * this.a3 + this.c1 * this.a2 * this.b3
            - this.c1 * this.b2 * this.a3 - this.b1 * this.a2 * this.c3 - this.a1 * this.c2 * this.b3;

        if (detM === 0) return this.clone();

        const ka1 = this.b2 * this.c3 - this.c2 * this.b3;
        const ka2 = this.a2 * this.c3 - this.c2 * this.a3;
        const ka3 = this.a2 * this.b3 - this.b2 * this.a3;

        const kb1 = this.b1 * this.c3 - this.c1 * this.b3;
        const kb2 = this.a1 * this.c3 - this.c1 * this.a3;
        const kb3 = this.a1 * this.b3 - this.b1 * this.a3;

        const kc1 = this.b1 * this.c2 - this.c1 * this.b2;
        const kc2 = this.a1 * this.c2 - this.c1 * this.a2;
        const kc3 = this.a1 * this.b2 - this.b1 * this.a2;

        const q = 1 / detM, m = new Matrix3();
        m.a1 = q * ka1; m.b1 = -q * kb1; m.c1 = q * kc1;
        m.a2 = -q * ka2; m.b2 = q * kb2; m.c2 = -q * kc2;
        m.a3 = q * ka3, m.b3 = -q * kb3, m.c3 = q * kc3;

        return m;
    }

    transpose() {
        const a2 = this.b1, a3 = this.c1;
        const b1 = this.a2, b3 = this.c2;
        const c1 = this.a3, c2 = this.b3;

        this.b1 = b1; this.c1 = c1;
        this.a2 = a2; this.c2 = c2;
        this.a3 = a3; this.b3 = b3;

        return this;
    }
    */
}