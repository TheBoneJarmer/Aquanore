import { Color } from "../color";
import { Material } from "./material";

export class StandardMaterial extends Material {
    #ambient = null;
    #color = null;
    #colorMap = null;
    #normalMap = null;

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    get colorMap() {
        return this.#colorMap;
    }

    set colorMap(value) {
        this.#colorMap = value;
    }

    get normalMap() {
        return this.#normalMap;
    }

    set normalMap(value) {
        this.#normalMap = value;
    }

    get ambient() {
        return this.#ambient;
    }

    set ambient(value) {
        this.#ambient = value;
    }

    constructor() {       
        super();
        
        this.#color = new Color(255, 255, 255);
        this.#ambient = new Color(55, 55, 55);
        this.#colorMap = null;
        this.#normalMap = null;
    }
}