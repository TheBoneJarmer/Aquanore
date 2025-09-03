export class Model {
    #data = null;
    #animations = [];

    get data() {
        return this.#data;
    }

    set data(value) {
        this.#data = value;
    }

    get animations() {
        return this.#animations;
    }

    set animations(value) {
        this.#animations = value;
    }

    constructor() {
        this.#data = null;
        this.#animations = [];
    }
}