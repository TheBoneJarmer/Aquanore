import { Color } from "../color";

export class BasicMaterial {
    #color = null;

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    constructor() {
        this.#color = new Color(255, 255, 255);
    }
}