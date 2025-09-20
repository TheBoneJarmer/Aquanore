import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

export class Shaders {
    static #polygon = null;
    static #model = null;

    static get polygon() {
        return this.#polygon;
    }

    static get model() {
        return this.#model;
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.#polygon = new Shader(ShaderSources.POLYGON_V, ShaderSources.POLYGON_F);
        this.#model = new Shader(ShaderSources.MODEL_V, ShaderSources.MODEL_F);
    }
}