import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

export class Shaders {
    static #polygon = null;
    static #model = null;
    static #shadow = null;
    static #screen = null;

    static get polygon() {
        return this.#polygon;
    }

    static get model() {
        return this.#model;
    }

    static get shadow() {
        return this.#shadow;
    }

    static get screen() {
        return this.#screen;
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.#polygon = new Shader(ShaderSources.POLYGON_V, ShaderSources.POLYGON_F);
        this.#model = new Shader(ShaderSources.MODEL_V, ShaderSources.MODEL_F);
        this.#shadow = new Shader(ShaderSources.SHADOW_V, ShaderSources.SHADOW_F);
        this.#screen = new Shader(ShaderSources.SCREEN_V, ShaderSources.SCREEN_F);
    }
}