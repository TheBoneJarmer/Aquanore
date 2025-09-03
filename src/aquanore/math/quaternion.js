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
}