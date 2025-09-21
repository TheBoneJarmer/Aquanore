export class Vector3 {
    static readonly ZERO = new Vector3(0, 0, 0);
    static readonly ONE = new Vector3(1, 1, 1);
    static readonly UP = new Vector3(0, 1, 0);
    static readonly DOWN = new Vector3(0, -1, 0);
    static readonly LEFT = new Vector3(-1, 0, 0);
    static readonly RIGHT = new Vector3(1, 0, 0);
    static readonly FORWARD = new Vector3(0, 0, 1);
    static readonly BACKWARD = new Vector3(0, 0, -1);

    private _x: number;
    private _y: number;
    private _z: number;

    /**
     * The x value
     * @return {number}
     */
    get x(): number {
        return this._x;
    }

    /**
     * Sets the x value
     * @param {number} value
     */
    set x(value: number) {
        this._x = value;
    }

    /**
     * The y value
     * @return {number}
     */
    get y(): number {
        return this._y;
    }

    /**
     * Sets the y value
     * @param {number} value
     */
    set y(value: number) {
        this._y = value;
    }

    /**
     * The z value
     * @return {number}
     */
    get z(): number {
        return this._z;
    }

    /**
     * Sets the z value
     * @param {number} value
     */
    set z(value: number) {
        this._z = value;
    }

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns a new Vector3 instance with the values from this Vector3 instance.
     * @returns {Vector3}
     */
    clone(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    /**
     * Calculates the length of the vector
     * @param {Vector3} v 
     * @returns {number}
     */
    static length(v: Vector3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    /**
     * Normalizes the vector and returns the result
     * @param {Vector3} v 
     * @returns {Vector3}
     */
    static normalized(v: Vector3): Vector3 {
        const scalar = 1 / this.length(v);

        if (isFinite(scalar)) {
            return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
        }

        return new Vector3();
    }

    /**
     * Calculates the cross product of vector `v1` and vector `v2`.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static cross(v1: Vector3, v2: Vector3): Vector3 {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = -(v1.x * v2.z - v1.z * v2.x);
        const z = v1.x * v2.y - v1.y * v2.x;

        return new Vector3(x, y, z);
    }

    /**
     * Calculates the cross product of vector `v1` and vector `v2`.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {number}
     */
    static dot(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Calculates the linear interpolated value of two vectors and returns it.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @param {number} t 
     * @returns {Vector3}
     */
    static lerp(v1: Vector3, v2: Vector3, t: number): Vector3 {
        const v = new Vector3();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);

        return v;
    }

    /* BASIC MATH */
    /**
     * Calculates the sum of two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Subtracts two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static sub(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * Multiplies two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static mult(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    /**
     * Divide two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static div(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
}