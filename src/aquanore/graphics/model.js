export class Model {
    #data = null;
    #animations = [];
    #skins = [];

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

    get skins() {
        return this.#skins;
    }

    set skins(value) {
        this.#skins = value;
    }

    constructor() {
        this.#data = null;
        this.#animations = [];
        this.#skins = [];
    }
}