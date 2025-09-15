import { Color } from "./color";
import { Vector3 } from "../math";

export class Light {
    #type;
    #source;
    #color;
    #enabled;
    #strength;
    #range;

    /**
     * Returns the light type
     * @return {number}
     */
    get type() {
        return this.#type;
    }

    /**
     * Set the light type
     * @param {number} value
     */
    set type(value) {
        this.#type = value;
    }

    /**
     * Returns the light source
     * @return {Vector3}
     */
    get source() {
        return this.#source;
    }

    /**
     * Sets the light source
     * @param {Vector3} value
     */
    set source(value) {
        this.#source = value;
    }

    /**
     * Returns the light color
     * @return {Color}
     */
    get color() {
        return this.#color;
    }

    /**
     * Sets the light color
     * @param {Color} value
     */
    set color(value) {
        this.#color = value;
    }

    /**
     * Returns true if the light is enabled or false if it isn't
     * @return {boolean}
     */
    get enabled() {
        return this.#enabled;
    }

    /**
     * Enables or disables the light
     * @param {boolean} value
     */
    set enabled(value) {
        this.#enabled = value;
    }

    /**
     * Returns the light range. For non-directional lights only.
     * @return {number}
     */
    get range() {
        return this.#range;
    }

    /**
     * Sets the light range. The value be larger than 0. For non-directional lights only.
     * @param {number} value
     */
    set range(value) {
        if (value <= 0) {
            throw new Error("Light range must be higher than 0");
        }

        this.#range = value;
    }

    /**
     * Returns the light's strength. For non-directional lights only.
     */
    get strength() {
        return this.#strength;
    }

    /**
     * Sets the light strength. The value be larger than 0. For non-directional lights only.
     */
    set strength(value) {
        if (value <= 0) {
            throw new Error("Light strength must be higher than 0");
        }

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