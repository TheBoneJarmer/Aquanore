import { Matrix4 } from "./matrix4";
import { Vector3 } from "./vector3";

export class Quaternion {
    static readonly EPSILON = 0.00001;
    static readonly ONE = new Quaternion(1, 1, 1, 1);
    static readonly ZERO = new Quaternion(0, 0, 0, 1);

    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    /**
     * Returns the x component of this quaternion
     * @returns {number}
     */
    get x(): number {
        return this._x;
    }

    /**
     * Sets the x component of this quaternion
     * @param {number} value
     */
    set x(value: number) {
        this._x = value;
    }

    /**
     * Returns the y component of this quaternion
     * @returns {number}
     */
    get y(): number {
        return this._y;
    }

    /**
     * Sets the y component of this quaternion
     * @param {number} value
     */
    set y(value: number) {
        this._y = value;
    }

    /**
     * Returns the z component of this quaternion
     * @returns {number}
     */
    get z(): number {
        return this._z;
    }

    /**
     * Sets the z component of this quaternion
     * @param {number} value
     */
    set z(value: number) {
        this._z = value;
    }

    /**
     * Returns the w component of this quaternion
     * @returns {number}
     */
    get w(): number {
        return this._w;
    }

    /**
     * Sets the w component of this quaternion
     * @param {number} value
     */
    set w(value: number) {
        this._w = value;
    }

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    /**
     * Returns a deep clone of this object
     * @returns {Quaternion}
     */
    clone(): Quaternion {
        return new Quaternion(this._x, this._y, this._z, this._w);
    }

    toString(): string {
        return `${this._x},${this._y},${this._z},${this._w}`;
    }

    /**
     * Converts a quaternion to euler angles
     * @param {Quaternion} q
     * @returns {Vector3}
     */
    static toEuler(q: Quaternion): Vector3 {
        const m = Matrix4.compose(Vector3.ZERO, q, Vector3.ONE);
        const euler = Matrix4.extractRotation(m);

        return euler;
    }

    /**
     * Constructs a quaternion from euler angles
     * @param {Vector3} v
     * @returns {Quaternion}
     */
    static fromEuler(v: Vector3): Quaternion {
        const roll = v.x;
        const pitch = v.y;
        const yaw = v.z;

        const cy = Math.cos(yaw * 0.5);
        const sy = Math.sin(yaw * 0.5);
        const cp = Math.cos(pitch * 0.5);
        const sp = Math.sin(pitch * 0.5);
        const cr = Math.cos(roll * 0.5);
        const sr = Math.sin(roll * 0.5);

        const q = new Quaternion();
        q.w = cr * cp * cy + sr * sp * sy;
        q.x = sr * cp * cy - cr * sp * sy;
        q.y = cr * sp * cy + sr * cp * sy;
        q.z = cr * cp * sy - sr * sp * cy;

        return q;
    }

    /**
     * Calculates the length of a quaternion
     * @param {Quaternion} q
     * @returns {number}
     */
    static length(q: Quaternion): number {
        return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    }

    /**
     * Normalizes the components of a quaternion
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    static normalized(q: Quaternion): Quaternion {
        const length = this.length(q);

        if (length < this.EPSILON) {
            return Quaternion.ZERO;
        }

        const scalar = 1 / length;
        return new Quaternion(q.x * scalar, q.y * scalar, q.z * scalar, q.w * scalar);
    }

    /**
     * Inverses a queaternion
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    static inversed(q: Quaternion): Quaternion {
        return new Quaternion(q.x * -1, q.y * -1, q.z * -1, q.w);
    }

    /**
     * Calculates the spherical linear position between two quaternions
     * @param {Quaternion} q1
     * @param {Quaternion} q2
     * @param {number} t
     * @returns {Quaternion}
     */
    static slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
        if (t === 0) {
            return q1;
        }

        if (t === 1) {
            return q2;
        }

        let x = q1.x;
        let y = q1.y;
        let z = q1.z;
        let w = q1.w;
        let cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

        if (cosHalfTheta < 0) {
            x = -q2.x;
            y = -q2.y;
            z = -q2.z;
            w = -q2.w;

            cosHalfTheta = -cosHalfTheta;
        } else {
            x = q2.x;
            y = q2.y;
            z = q2.z;
            w = q2.w;
        }

        if (cosHalfTheta >= 1.0) {
            return new Quaternion(x, y, z, w);
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= this.EPSILON) {
            const s = 1 - t;

            x = s * x + t * x;
            y = s * y + t * y;
            z = s * z + t * z;
            w = s * w + t * w;

            let q = new Quaternion(x, y, z, w);
            q = Quaternion.normalized(q);

            return q;
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        x = (q1.x * ratioA + x * ratioB);
        y = (q1.y * ratioA + y * ratioB);
        z = (q1.z * ratioA + z * ratioB);
        w = (q1.w * ratioA + w * ratioB);

        return new Quaternion(x, y, z, w);
    }
    
    static dot(q1: Quaternion, q2: Quaternion): number {
        return q1._x * q2._x + q1._y * q2._y + q1._z * q2._z + q1._w * q2._w;
    }

    static floor(q: Quaternion): Quaternion {
        return new Quaternion(Math.floor(q.x), Math.floor(q.y), Math.floor(q.z), Math.floor(q.w));
    }

    static ceil(q: Quaternion): Quaternion {
        return new Quaternion(Math.ceil(q.x), Math.ceil(q.y), Math.floor(q.z), Math.floor(q.w));
    }

    static round(v: Quaternion): Quaternion {
        return new Quaternion(Math.round(v.x), Math.round(v.y), Math.round(v.z), Math.round(v.w));
    }

    /* BASIC MATH */
    static add(q: Quaternion, value: Quaternion | number): Quaternion {
        if (value instanceof Quaternion) {
            return new Quaternion(q.x + value.x, q.y + value.y, q.z + value.z, q.w + value.w);
        } else {
            return new Quaternion(q.x + value, q.y + value, q.z + value, q.w + value);
        }
    }

    static sub(q: Quaternion, value: Quaternion | number): Quaternion {
        if (value instanceof Quaternion) {
            return new Quaternion(q.x - value.x, q.y - value.y, q.z - value.z, q.w - value.w);
        } else {
            return new Quaternion(q.x - value, q.y - value, q.z - value, q.w - value);
        }
    }

    static mult(q: Quaternion, value: Quaternion | number): Quaternion {
        let qax = q.x, qay = q.y, qaz = q.z, qaw = q.w;
        let qbx = 0, qby = 0, qbz = 0, qbw = 0;

        if (value instanceof Quaternion) {
            qbx = value.x, qby = value.y, qbz = value.z, qbw = value.w;
        } else {
            qbx = value, qby = value, qbz = value, qbw = value;
        }

        const x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        const y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        const z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        const w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return new Quaternion(x, y, z, w);
    }
}