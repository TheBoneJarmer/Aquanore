export class Vector3 {
    #x = 0;
    #y = 0;
    #z = 0;

    static get ZERO() {
        return new Vector3(0, 0, 0);
    }

    static get ONE() {
        return new Vector3(1, 1, 1);
    }

    static get UP() {
        return new Vector3(0, 1, 0);
    }

    static get DOWN() {
        return new Vector3(0, -1, 0);
    }

    static get LEFT() {
        return new Vector3(-1, 0, 0);
    }

    static get RIGHT() {
        return new Vector3(1, 0, 0);
    }

    static get FORWARD() {
        return new Vector3(0, 0, 1);
    }

    static get BACKWARD() {
        return new Vector3(0, 0, -1);
    }

    /**
     * The x value
     * @return {number}
     */
    get x() {
        return this.#x;
    }

    /**
     * Sets the x value
     * @param {number} value
     */
    set x(value) {
        this.#x = value;
    }

    /**
     * The y value
     * @return {number}
     */
    get y() {
        return this.#y;
    }

    /**
     * Sets the y value
     * @param {number} value
     */
    set y(value) {
        this.#y = value;
    }

    /**
     * The z value
     * @return {number}
     */
    get z() {
        return this.#z;
    }

    /**
     * Sets the z value
     * @param {number} value
     */
    set z(value) {
        this.#z = value;
    }

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns a new Vector3 instance with the values from this Vector3 instance.
     * @returns {Vector3}
     */
    clone() {
        return new Vector3(this.#x, this.#y, this.#z);
    }

    /**
     * Calculates the length of the vector
     * @param {Vector3} v 
     * @returns {number}
     */
    static length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    /**
     * Normalizes the vector and returns the result
     * @param {Vector3} v 
     * @returns {Vector3}
     */
    static normalized(v) {
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
    static cross(v1, v2) {
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
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Calculates the linear interpolated value of two vectors and returns it.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @param {number} t 
     * @returns {Vector3}
     */
    static lerp(v1, v2, t) {
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
    static add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Subtracts two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static sub(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * Multiplies two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static mult(v1, v2) {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    /**
     * Divide two vectors.
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3}
     */
    static div(v1, v2) {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
}