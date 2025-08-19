import { IClonable } from "./interfaces/iclonable";
import { Matrix4 } from "./matrix4";

export class Matrix3 implements IClonable<Matrix3> {
    private _array: number[];

    public get x1(): number {
        return this._array[0];
    }

    public set x1(value: number) {
        this._array[0] = value;
    }

    public get y1(): number {
        return this._array[1];
    }

    public set y1(value: number) {
        this._array[1] = value;
    }

    public get z1(): number {
        return this._array[2];
    }

    public set z1(value: number) {
        this._array[2] = value;
    }

    public get x2(): number {
        return this._array[4];
    }

    public set x2(value: number) {
        this._array[4] = value;
    }

    public get y2(): number {
        return this._array[5];
    }

    public set y2(value: number) {
        this._array[5] = value;
    }

    public get z2(): number {
        return this._array[6];
    }

    public set z2(value: number) {
        this._array[6] = value;
    }

    public get x3(): number {
        return this._array[8];
    }

    public set x3(value: number) {
        this._array[8] = value;
    }

    public get y3(): number {
        return this._array[9];
    }

    public set y3(value: number) {
        this._array[9] = value;
    }

    public get z3(): number {
        return this._array[10];
    }

    public set z3(value: number) {
        this._array[10] = value;
    }

    public get values(): number[] {
        return this._array;
    }

    public set values(values: number[]) {
        this._array = values;
    }

    constructor(values: number[] = []) {
        this._array = values;
    }

    public clone(): Matrix3 {
        return new Matrix3(this.values.map(x => x));
    }

    public static identity(): Matrix3 {
        const values = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];

        return new Matrix3(values);
    }

    public static from(src: Matrix3 | Matrix4): Matrix3 {
        let values: number[] = [];

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