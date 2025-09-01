import { Vector3 } from "../math";

export class Camera {
    #position = null;
    #rotation = null;
    #fov = 0;
    #near = 0;
    #far = 0;
    #aspect = 0;

    get position() {
        return this.#position;
    }

    set position(value) {
        this.#position = value;
    }

    get rotation() {
        return this.#rotation;
    }

    set rotation(value) {
        this.#rotation = value;
    }

    get fov() {
        return this.#fov;
    }

    set fov(value) {
        this.#fov = value;
    }

    get near() {
        return this.#near;
    }

    set near(value) {
        this.#near = value;
    }

    get far() {
        return this.#far;
    }

    set far(value) {
        this.#far = value;
    }

    get aspect() {
        return this.#aspect;
    }

    set aspect(value) {
        this.#aspect = value;
    }

    constructor(fov, aspect, near, far) {
        this.#position = new Vector3();
        this.#rotation = new Vector3();
        this.#fov = fov;
        this.#near = near;
        this.#far = far;
        this.#aspect = aspect;
    }
}