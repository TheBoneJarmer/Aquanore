import { Vector3 } from "./vector3";

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

    static toEuler(q) {
        const x = q.x;
        const y = q.y;
        const z = q.z;
        const w = q.w;

        // Roll (x-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        // Pitch (y-axis rotation)
        let sinp = 2 * (w * y - z * x);
        sinp = Math.max(-1, Math.min(1, sinp)); // clamp for numerical stability
        const pitch = Math.asin(sinp);

        // Yaw (z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return new Vector3(roll, pitch, yaw);
    }

    static fromEuler(v) {
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

    static slerp(q1, q2, t) {
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

            return new Quaternion(x, y, z, w).normalize();
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

    static dot(q1, q2) {
        return q1._x * q2._x + q1._y * q2._y + q1._z * q2._z + q1._w * q2._w;
    }

    /* BASIC MATH */
    static add(q1, q2) {
        return new Quaternion(q1.x + q2.x, q1.y + q2.y, q1.z + q2.z, q1.w + q2.w);
    }

    static sub(q1, q2) {
        return new Quaternion(q1.x - q2.x, q1.y - q2.y, q1.z - q2.z, q1.w - q2.w);
    }

    static mult(q1, q2) {
        const qax = q1.x, qay = q1.y, qaz = q1.z, qaw = q1.w;
		const qbx = q2.x, qby = q2.y, qbz = q2.z, qbw = q2.w;

		const x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		const y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		const z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		const w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return new Quaternion(x, y, z, w);
    }
}