import { Vector3 } from "../math";

export class MeshGroup {
    #translation = null;
    #rotation = null;
    #scale = null;
    #children = null;
    #name = null;
    #index = 0;

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

    set children(value) {
        this.#children = value;
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

    constructor() {
        this.#translation = new Vector3(0, 0, 0);
        this.#rotation = new Vector3(0, 0, 0);
        this.#scale = new Vector3(1, 1, 1);
        this.#children = [];
        this.#name = "MeshGroup";
    }
}