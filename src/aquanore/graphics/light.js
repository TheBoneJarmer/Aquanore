import { Color } from "./color";
import { Vector3 } from "../math";

export class Light {
    #type;
    #source;
    #color;
    #enabled;
    #strength;
    #range;

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get source() {
        return this.#source;
    }

    set source(value) {
        this.#source = value;
    }

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    get enabled() {
        return this.#enabled;
    }

    set enabled(value) {
        this.#enabled = value;
    }

    get range() {
        return this.#range;
    }

    set range(value) {
        this.#range = value;
    }

    get strength() {
        return this.#strength;
    }

    set strength(value) {
        this.#strength = value;
    }

    constructor(type) {
        this.#type = type;
        this.#source = new Vector3(1,1,1);
        this.#color = new Color(255, 255, 255);
        this.#enabled = true;
        this.#strength = 1;
        this.#range = 10;
    }
}