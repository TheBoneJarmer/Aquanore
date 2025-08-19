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
        this._array = values;
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

    public static frustum(left: number, right: number, top: number, bottom: number, near: number, far: number): Matrix4 {
        const x = right - left;
        const y = bottom - top;
        const z = far - near;

        const m = this.identity();
        m.x1 = near * 2 / x;
        m.y2 = near * 2 / y;
        m.x3 = (right + left) / x;
        m.y3 = (bottom + top) / y;
        m.z3 = -(far + near) / z;
        m.w3 = -1;
        m.z4 = -(far * near * 2) / z;

        return m;
    }

    public static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
        const topRate = near * Math.tan(fov * Math.PI / 360);
        const widthRate = topRate * aspect;

        const m = this.frustum(-widthRate, widthRate, -topRate, topRate, near, far);
        return m;
    }

    public static transpose(mat: Matrix4): Matrix4 {
        const x2 = mat.y1, x3 = mat.z1, x4 = mat.w1;
        const y1 = mat.x2, y3 = mat.z2, y4 = mat.w2;
        const z1 = mat.x3, z2 = mat.y3, z4 = mat.w3;
        const w1 = mat.x4, w2 = mat.y4, w3 = mat.z4;

        const result = mat.clone();
        result.y1 = y1; result.z1 = z1; result.w1 = w1;
        result.x2 = x2; result.z2 = z2; result.w2 = w2;
        result.x3 = x3; result.y3 = y3; result.w3 = w3;
        result.x4 = x4; result.y4 = y4; result.z4 = z4;

        return result;
    }

    public static inverse(mat: Matrix4): Matrix4 {
        const
            a = mat.x1, b = mat.y1, c = mat.z1, d = mat.w1,
            e = mat.x2, f = mat.y2, g = mat.z2, h = mat.w2,
            i = mat.x3, j = mat.y3, k = mat.z3, l = mat.w3,
            m = mat.x4, n = mat.y4, o = mat.z4, p = mat.w4;

        const q = f * k * p + j * o * h + n * g * l - f * l * o - g * j * p - h * k * n;
        const r = e * k * p + i * o * h + m * g * l - e * l * o - g * i * p - h * k * m;
        const s = e * j * p + i * n * h + m * f * l - e * l * n - f * i * p - h * j * m;
        const t = e * j * o + i * n * g + m * f * k - e * k * n - f * i * o - g * j * m;

        const delta = (a * q - b * r + c * s - d * t);

        if (delta === 0) {
            return mat.clone();
        };

        const detM = 1 / delta;

        // adj
        let m2x1 = q, m2y1 = r, m2z1 = s, m2w1 = t;
        let m2x2 = b * k * p + j * o * d + n * c * l - b * l * o - c * j * p - d * k * n;
        let m2y2 = a * k * p + i * o * d + m * c * l - a * l * o - c * i * p - d * k * m;
        let m2z2 = a * j * p + i * n * d + m * b * l - a * l * n - b * i * p - d * j * m;
        let m2w2 = a * j * o + i * n * c + m * b * k - a * k * n - b * i * o - c * j * m;
        let m2x3 = b * g * p + f * o * d + n * c * h - b * h * o - c * f * p - d * g * n;
        let m2y3 = a * g * p + e * o * d + m * c * h - a * h * o - c * e * p - d * g * m;
        let m2z3 = a * f * p + e * n * d + m * b * h - a * h * n - b * e * p - d * f * m;
        let m2w3 = a * f * o + e * n * c + m * b * g - a * g * n - b * e * o - c * f * m;
        let m2x4 = b * g * l + f * k * d + j * c * h - b * h * k - c * f * l - d * g * j;
        let m2y4 = a * g * l + e * k * d + i * c * h - a * h * k - c * e * l - d * g * i;
        let m2z4 = a * f * l + e * j * d + i * b * h - a * h * j - b * e * l - d * f * i;
        let m2w4 = a * f * k + e * j * c + i * b * g - a * g * j - b * e * k - c * f * i;

        m2y1 = -m2y1; m2w1 = -m2w1;
        m2x2 = -m2x2; m2z2 = -m2z2;
        m2y3 = -m2y3; m2w3 = -m2w3;
        m2x4 = -m2x4; m2z4 = -m2z4;

        // transpose
        const m3x1 = m2x1, m3y1 = m2x2, m3z1 = m2x3, m3w1 = m2x4;
        const m3x2 = m2y1, m3y2 = m2y2, m3z2 = m2y3, m3w2 = m2y4;
        const m3x3 = m2z1, m3y3 = m2z2, m3z3 = m2z3, m3w3 = m2z4;
        const m3x4 = m2w1, m3y4 = m2w2, m3z4 = m2w3, m3w4 = m2w4;

        const result = mat.clone();
        result.x1 = m3x1 * detM; result.y1 = m3y1 * detM; result.z1 = m3z1 * detM; result.w1 = m3w1 * detM;
        result.x2 = m3x2 * detM; result.y2 = m3y2 * detM; result.z2 = m3z2 * detM; result.w2 = m3w2 * detM;
        result.x3 = m3x3 * detM; result.y3 = m3y3 * detM; result.z3 = m3z3 * detM; result.w3 = m3w3 * detM;
        result.x4 = m3x4 * detM; result.y4 = m3y4 * detM; result.z4 = m3z4 * detM; result.w4 = m3w4 * detM;

        return result;
    }
}