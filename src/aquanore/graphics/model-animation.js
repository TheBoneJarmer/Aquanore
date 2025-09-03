export class ModelAnimation {
    #name = null;
    #channels = [];

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get channels() {
        return this.#channels;
    }

    set channels(value) {
        this.#channels = value;
    }

    constructor() {

    }
}