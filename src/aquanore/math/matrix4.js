import { MathHelper } from "./mathhelper";
import { Vector3 } from "./vector3";

export class Matrix4 {
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

    get w1() {
        return this.#array[3];
    }

    set w1(value) {
        this.#array[3] = value;
    }

    get x2() {
        return this.#array[4];
    }

    set x2(value) {
        this.#array[4] = value;
    }

    get y2() {
        return this.#array[5];
    }

    set y2(value) {
        this.#array[5] = value;
    }

    get z2() {
        return this.#array[6];
    }

    set z2(value) {
        this.#array[6] = value;
    }

    get w2() {
        return this.#array[7];
    }

    set w2(value) {
        this.#array[7] = value;
    }

    get x3() {
        return this.#array[8];
    }

    set x3(value) {
        this.#array[8] = value;
    }

    get y3() {
        return this.#array[9];
    }

    set y3(value) {
        this.#array[9] = value;
    }

    get z3() {
        return this.#array[10];
    }

    set z3(value) {
        this.#array[10] = value;
    }

    get w3() {
        return this.#array[11];
    }

    set w3(value) {
        this.#array[11] = value;
    }

    get x4() {
        return this.#array[12];
    }

    set x4(value) {
        this.#array[12] = value;
    }

    get y4() {
        return this.#array[13];
    }

    set y4(value) {
        this.#array[13] = value;
    }

    get z4() {
        return this.#array[14];
    }

    set z4(value) {
        this.#array[14] = value;
    }

    get w4() {
        return this.#array[15];
    }

    set w4(value) {
        this.#array[15] = value;
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
        return new Matrix4(this.values.map(x => x));
    }

    static identity() {
        const values = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        return new Matrix4(values);
    }

    static compose(translation, quaternion, scale) {
        const te = [];

        const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = scale.x, sy = scale.y, sz = scale.z;

        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;

        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;

        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;

        te[12] = translation.x;
        te[13] = translation.y;
        te[14] = translation.z;
        te[15] = 1;

        return new Matrix4(te);
    }

    static translate(m, x, y, z) {
        const result = m.clone();
        result.x4 += m.x1 * x + m.x2 * y + m.x3 * z;
        result.y4 += m.y1 * x + m.y2 * y + m.y3 * z;
        result.z4 += m.z1 * x + m.z2 * y + m.z3 * z;
        result.w4 += m.w1 * x + m.w2 * y + m.w3 * z;

        return result;
    }

    static scale(m, x, y, z) {
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

    static rotate(m, x, y, z) {
        let result = m.clone();
        result = this.rotateX(result, x);
        result = this.rotateY(result, y);
        result = this.rotateZ(result, z);

        return result;
    }

    static rotateX(m, angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

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

    static rotateY(m, angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

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

    static rotateZ(m, angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

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

    static frustum(left, right, top, bottom, near, far) {
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

    static perspective(fov, aspect, near, far) {
        const topRate = near * Math.tan(fov * Math.PI / 360);
        const widthRate = topRate * aspect;

        const m = this.frustum(-widthRate, widthRate, -topRate, topRate, near, far);
        return m;
    }

    static ortho(left, right, top, bottom, near, far) {
        const te = [];
        const x = 2 / (right - left);
        const y = 2 / (top - bottom);
        const a = - (right + left) / (right - left);
        const b = - (top + bottom) / (top - bottom);
        const c = - 2 / (far - near);
        const d = - (far + near) / (far - near);

        te[0] = x; te[4] = 0; te[8] = 0; te[12] = a;
        te[1] = 0; te[5] = y; te[9] = 0; te[13] = b;
        te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
        te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

        return new Matrix4(te);
    }

    static lookAt(eye, target, up) {
        const m = Matrix4.identity();
        const zaxis = Vector3.normalized(Vector3.sub(eye, target));
        const xaxis = Vector3.normalized(Vector3.cross(up, zaxis));
        const yaxis = Vector3.cross(zaxis, xaxis);

        m.x1 = xaxis.x; m.y1 = yaxis.x; m.z1 = zaxis.x; m.w1 = 0;
        m.x2 = xaxis.y; m.y2 = yaxis.y; m.z2 = zaxis.y; m.w2 = 0;
        m.x3 = xaxis.z; m.y3 = yaxis.z; m.z3 = zaxis.z; m.w3 = 0;
        m.x4 = 0; m.y4 = 0; m.z4 = 0; m.w4 = 1;

        return m;
    }

    static transpose(m) {
        const x2 = m.y1, x3 = m.z1, x4 = m.w1;
        const y1 = m.x2, y3 = m.z2, y4 = m.w2;
        const z1 = m.x3, z2 = m.y3, z4 = m.w3;
        const w1 = m.x4, w2 = m.y4, w3 = m.z4;

        const result = m.clone();
        result.y1 = y1; result.z1 = z1; result.w1 = w1;
        result.x2 = x2; result.z2 = z2; result.w2 = w2;
        result.x3 = x3; result.y3 = y3; result.w3 = w3;
        result.x4 = x4; result.y4 = y4; result.z4 = z4;

        return result;
    }

    static inverse(m) {
        const
            a = m.x1, b = m.y1, c = m.z1, d = m.w1,
            e = m.x2, f = m.y2, g = m.z2, h = m.w2,
            i = m.x3, j = m.y3, k = m.z3, l = m.w3,
            m = m.x4, n = m.y4, o = m.z4, p = m.w4;

        const q = f * k * p + j * o * h + n * g * l - f * l * o - g * j * p - h * k * n;
        const r = e * k * p + i * o * h + m * g * l - e * l * o - g * i * p - h * k * m;
        const s = e * j * p + i * n * h + m * f * l - e * l * n - f * i * p - h * j * m;
        const t = e * j * o + i * n * g + m * f * k - e * k * n - f * i * o - g * j * m;

        const delta = (a * q - b * r + c * s - d * t);

        if (delta === 0) {
            return m.clone();
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

        const result = m.clone();
        result.x1 = m3x1 * detM; result.y1 = m3y1 * detM; result.z1 = m3z1 * detM; result.w1 = m3w1 * detM;
        result.x2 = m3x2 * detM; result.y2 = m3y2 * detM; result.z2 = m3z2 * detM; result.w2 = m3w2 * detM;
        result.x3 = m3x3 * detM; result.y3 = m3y3 * detM; result.z3 = m3z3 * detM; result.w3 = m3w3 * detM;
        result.x4 = m3x4 * detM; result.y4 = m3y4 * detM; result.z4 = m3z4 * detM; result.w4 = m3w4 * detM;

        return result;
    }

    static multiply(m1, m2) {
        const ae = m1.values;
        const be = m2.values;
        const te = [];

        const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return new Matrix4(te);
    }

    static extractTranslation(m) {
        const v = new Vector3();
        v.x = m.values[12];
        v.y = m.values[13];
        v.z = m.values[14];

        return v;
    }

    static extractScale(m) {
        const sx = new Vector3();
        sx.x = m.values[0];
        sx.y = m.values[1];
        sx.z = m.values[2];

        const sy = new Vector3();
        sy.x = m.values[4];
        sy.y = m.values[5];
        sy.z = m.values[6];

        const sz = new Vector3();
        sz.x = m.values[8];
        sz.y = m.values[9];
        sz.z = m.values[10];

        const v = new Vector3();
        v.x = Vector3.length(sx);
        v.y = Vector3.length(sy);
        v.z = Vector3.length(sz);

        return v;
    }

    static extractRotation(m) {
        const te = m.values;
        const m11 = te[0], m12 = te[4], m13 = te[8];
        const m21 = te[1], m22 = te[5], m23 = te[9];
        const m31 = te[2], m32 = te[6], m33 = te[10];

        const v = new Vector3();
        v.y = Math.asin(MathHelper.clamp(m13, - 1, 1));

        if (Math.abs(m13) < 0.9999999) {
            v.x = Math.atan2(- m23, m33);
            v.z = Math.atan2(- m12, m11);
        } else {
            v.x = Math.atan2(m32, m22);
            v.z = 0;
        }

        return v;
    }
}