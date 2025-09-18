import { Aquanore } from "../aquanore";
import { LightType } from "../enums";
import { Camera } from "./camera";
import { Light } from "./light";

export class Scene {
    static #camera = null;
    static #lights = null;

    static get camera() {
        return this.#camera;
    }

    static set camera(value) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this.#camera = value;
    }

    static get lights() {
        return this.#lights;
    }

    static set lights(value) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this.#lights = value;
    }

    static reset() {
        this.#camera = new Camera(60, innerWidth / innerHeight, 0.001, 1000);

        this.#lights = [];
        this.#lights[0] = new Light(LightType.Directional);
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.reset();
    }

    static __update() {
        const cnv = Aquanore.canvas;
        this.#camera.aspect = cnv.width / cnv.height;
    }

    /* HELPER FUNCTIONS */
}