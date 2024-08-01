export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = value;
    }

    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = value;
    }

    get a(): number {
        return this._a;
    }

    set a(value: number) {
        this._a = value;
    }

    public constructor(r: number, g: number, b: number, a: number) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }
}