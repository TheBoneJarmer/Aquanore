import { IClonable } from "./interfaces/iclonable";
import { MathHelper } from "./mathhelper";

export class Matrix4 implements IClonable<Matrix4> {
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

    public get w1(): number {
        return this._array[3];
    }

    public set w1(value: number) {
        this._array[3] = value;
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

    public get w2(): number {
        return this._array[7];
    }

    public set w2(value: number) {
        this._array[7] = value;
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

    public get w3(): number {
        return this._array[11];
    }

    public set w3(value: number) {
        this._array[11] = value;
    }

    public get x4(): number {
        return this._array[12];
    }

    public set x4(value: number) {
        this._array[12] = value;
    }

    public get y4(): number {
        return this._array[13];
    }

    public set y4(value: number) {
        this._array[13] = value;
    }

    public get z4(): number {
        return this._array[14];
    }

    public set z4(value: number) {
        this._array[14] = value;
    }

    public get w4(): number {
        return this._array[15];
    }

    public set w4(value: number) {
        this._array[15] = value;
    }

    public get values(): number[] {
        return this._array;
    }

    public set values(values: number[]) {
        this._array = values;
    }

    constructor(values: number[] = []) {
        const identity = Matrix4.identity();

        if (values == null || values.length < 16) {
            this._array = identity.values;
        } else {
            this._array = values;
        }
    }

    public clone(): Matrix4 {
        return new Matrix4(this.values.map(x => x));
    }

    public static identity(): Matrix4 {
        const values = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        return new Matrix4(values);
    }

    public static translate(m: Matrix4, x: number, y: number, z: number): Matrix4 {
        const result = m.clone();
        result.x4 += m.x1 * x + m.x2 * y + m.x3 * z;
        result.y4 += m.y1 * x + m.y2 * y + m.y3 * z;
        result.z4 += m.z1 * x + m.z2 * y + m.z3 * z;
        result.w4 += m.w1 * x + m.w2 * y + m.w3 * z;

        return result;
    }

    public static scale(m: Matrix4, x: number, y: number, z: number): Matrix4 {
        const result = m.clone();
        result.x1 *= x;
        result.y1 *= x;
        result.z1 *= x;
        result.w1 *= x;

        result.x2 *= y;
        result.y2 *= y;
        result.z2 *= y;
        result.w2 *= y;

        result.x3 *= z;
        result.y3 *= z;
        result.z3 *= z;
        result.w3 *= z;

        return result;
    }

    public static rotate(m: Matrix4, x: number, y: number, z: number): Matrix4 {
        let result = m.clone();
        result = this.rotateX(result, x);
        result = this.rotateY(result, y);
        result = this.rotateZ(result, z);

        return result;
    }

    public static rotateX(m: Matrix4, radians: number): Matrix4 {
        const d = MathHelper.degrees(radians);
        const sin = Math.sin(d);
        const cos = Math.cos(d);

        const m2y2 = cos, m2z2 = sin;
        const m2y3 = -sin, m2z3 = cos;

        const x2 = m.x2 * m2y2 + m.x3 * m2z2;
        const y2 = m.y2 * m2y2 + m.y3 * m2z2;
        const z2 = m.z2 * m2y2 + m.z3 * m2z2;
        const w2 = m.w2 * m2y2 + m.w3 * m2z2;

        const x3 = m.x2 * m2y3 + m.x3 * m2z3;
        const y3 = m.y2 * m2y3 + m.y3 * m2z3;
        const z3 = m.z2 * m2y3 + m.z3 * m2z3;
        const w3 = m.w2 * m2y3 + m.w3 * m2z3;

        const result = m.clone();
        result.x2 = x2; result.y2 = y2; result.z2 = z2; result.w2 = w2;
        result.x3 = x3; result.y3 = y3; result.z3 = z3; result.w3 = w3;

        return result;
    }

    public static rotateY(m: Matrix4, radians: number): Matrix4 {
        const d = MathHelper.degrees(radians);
        const sin = Math.sin(d);
        const cos = Math.cos(d);

        const m2x1 = cos, m2z1 = -sin;
        const m2x3 = sin, m2c3 = cos;

        const x1 = m.x1 * m2x1 + m.x3 * m2z1;
        const y1 = m.y1 * m2x1 + m.y3 * m2z1;
        const z1 = m.z1 * m2x1 + m.z3 * m2z1;
        const d1 = m.w1 * m2x1 + m.w3 * m2z1;

        const x3 = m.x1 * m2x3 + m.x3 * m2c3;
        const y3 = m.y1 * m2x3 + m.y3 * m2c3;
        const c3 = m.z1 * m2x3 + m.z3 * m2c3;
        const d3 = m.w1 * m2x3 + m.w3 * m2c3;

        const result = m.clone();
        result.x1 = x1; result.y1 = y1; result.z1 = z1; result.w1 = d1;
        result.x3 = x3; result.y3 = y3; result.z3 = c3; result.w3 = d3;

        return result;
    }

    public static rotateZ(m: Matrix4, radians: number): Matrix4 {
        const d = MathHelper.degrees(radians);
        const sin = Math.sin(d);
        const cos = Math.cos(d);

        const m2x1 = cos, m2y1 = sin;
        const m2x2 = -sin, m2y2 = cos;

        const a1 = m.x1 * m2x1 + m.x2 * m2y1;
        const b1 = m.y1 * m2x1 + m.y2 * m2y1;
        const c1 = m.z1 * m2x1 + m.z2 * m2y1;
        const d1 = m.w1 * m2x1 + m.w2 * m2y1;

        const a2 = m.x1 * m2x2 + m.x2 * m2y2;
        const b2 = m.y1 * m2x2 + m.y2 * m2y2;
        const c2 = m.z1 * m2x2 + m.z2 * m2y2;
        const d2 = m.w1 * m2x2 + m.w2 * m2y2;

        const result = m.clone();
        result.x1 = a1; result.y1 = b1; result.z1 = c1; result.w1 = d1;
        result.x2 = a2; result.y2 = b2; result.z2 = c2; result.w2 = d2;

        return result;
    }

    public static perspective(m: Matrix4, fov: number, aspect: number, near: number, far: number): Matrix4 {
        let result = m.clone();
        

        return result;
    }
}