export class Color {
    #r = 0;
    #g = 0;
    #b = 0;
    #a = 0;

    get r() {
        return this.#r;
    }

    set r(value) {
        this.#r = value;
    }

    get g() {
        return this.#g;
    }

    set g(value) {
        this.#g = value;
    }

    get b() {
        return this.#b;
    }

    set b(value) {
        this.#b = value;
    }

    get a() {
        return this.#a;
    }

    set a(value) {
        this.#a = value;
    }

    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.#r = r;
        this.#g = g;
        this.#b = b;
        this.#a = a;
    }

    clone() {
        return new Color(this.#r, this.#g, this.#b, this.#a);
    }
}