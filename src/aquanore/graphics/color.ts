export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /**
     * Returns the red component of the color
     * @returns {number}
     */
    get r(): number {
        return this._r;
    }

    /**
     * Sets the red component of the color
     * @param {number} value
     */
    set r(value: number) {
        if (value < 0) throw new Error("Red value cannot be lower than 0");
        if (value > 255) throw new Error("Red value cannot be larger than 255");

        this._r = value;
    }

    /**
     * Returns the green component of the color
     * @returns {number}
     */
    get g(): number {
        return this._g;
    }

    /**
     * Sets the green component of the color
     * @param {number} value
     */
    set g(value: number) {
        if (value < 0) throw new Error("Green value cannot be lower than 0");
        if (value > 255) throw new Error("Green value cannot be larger than 255");

        this._g = value;
    }

    /**
     * Returns the blue component of the color
     * @returns {number}
     */
    get b(): number {
        return this._b;
    }

    /**
     * Sets the blue component of the color
     * @param {number} value
     */
    set b(value: number) {
        if (value < 0) throw new Error("Blue value cannot be lower than 0");
        if (value > 255) throw new Error("Blue value cannot be larger than 255");

        this._b = value;
    }

    /**
     * Returns the alpha component of the color
     * @returns {number}
     */
    get a(): number {
        return this._a;
    }

    /**
     * Sets the alpha component of the color
     * @param {number} value
     */
    set a(value: number) {
        if (value < 0) throw new Error("Alpha value cannot be lower than 0");
        if (value > 255) throw new Error("Alpha value cannot be larger than 255");

        this._a = value;
    }

    /**
     * Returns a deep clone of this object with only the rgb values leaving the alpha on 255
     * @returns {Color}
     */
    get rgb(): Color {
        return new Color(this._r, this._g, this._b, 255);
    }

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    /**
     * Returns a deep clone of this object
     * @returns {Color}
     */
    clone(): Color {
        return new Color(this._r, this._g, this._b, this._a);
    }

    toString(): string {
        return `${this._r},${this._g},${this._b},${this._a}`;
    }
}