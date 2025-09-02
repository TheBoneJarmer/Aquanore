import { Color } from "../color";
import { Material } from "./material";

export class BasicMaterial extends Material {
    #color = null;

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    constructor() {
        super();
        
        this.#color = new Color(255, 255, 255);
    }
}