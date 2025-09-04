import { Vector3 } from "../math";

export class Mesh {
    #translation = null;
    #rotation = null;
    #scale = null;
    #primitives = null;
    #name = null;
    #index = null;
    #skin = null;

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

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get index() {
        return this.#index;
    }

    set index(value) {
        this.#index = value;
    }

    get skin() {
        return this.#skin;
    }

    set skin(value) {
        this.#skin = value;
    }

    constructor() {
        this.#translation = new Vector3(0, 0, 0);
        this.#rotation = new Vector3(0, 0, 0);
        this.#scale = new Vector3(1, 1, 1);
        this.#primitives = [];
        this.#name = "Mesh";
    }
}