export class Mesh {
    #primitives = [];
    #translation = null;
    #rotation = null;
    #scale = null;

    get translation() {
        return this.#translation;
    }

    set translation(value) {
        this.#translation = value;
    }

    get rotation() {
        return this.#rotation;
    }

    set rotation(value) {
        this.#rotation = value;
    }

    get scale() {
        return this.#scale;
    }

    set scale(value) {
        this.#scale = value;
    }

    get primitives() {
        return this.#primitives;
    }

    constructor() {
        this.#primitives = [];
    }
}