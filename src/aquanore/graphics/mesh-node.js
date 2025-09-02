import { Vector3 } from "../math";

export class MeshNode {
    #translation = null;
    #rotation = null;
    #scale = null;
    #children = [];

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

    get children() {
        return this.#children;
    }

    constructor() {
        this.#translation = new Vector3(0, 0, 0);
        this.#rotation = new Vector3(0, 0, 0);
        this.#scale = new Vector3(1, 1, 1);
    }
}