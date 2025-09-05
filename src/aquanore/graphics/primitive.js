export class Primitive {
    #material = null;
    #geometry = null;

    get material() {
        return this.#material;
    }

    set material(value) {
        if (value == null) {
            throw new Error("Material cannot be null");
        }

        this.#material = value;
    }

    get geometry() {
        return this.#geometry;
    }

    set geometry(value) {
        this.#geometry = value;
    }

    constructor(geometry, mat) {
        this.#geometry = geometry;
        this.#material = mat;
    }
}