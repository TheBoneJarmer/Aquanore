import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

export class Shaders {
    private static _polygon: Shader;
    private static _model: Shader;
    private static _shadow: Shader;
    private static _screen: Shader;

    static get polygon() {
        return this._polygon;
    }

    static get model() {
        return this._model;
    }

    static get shadow() {
        return this._shadow;
    }

    static get screen() {
        return this._screen;
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this._polygon = new Shader(ShaderSources.POLYGON_V, ShaderSources.POLYGON_F);
        this._model = new Shader(ShaderSources.MODEL_V, ShaderSources.MODEL_F);
        this._shadow = new Shader(ShaderSources.SHADOW_V, ShaderSources.SHADOW_F);
        this._screen = new Shader(ShaderSources.SCREEN_V, ShaderSources.SCREEN_F);
    }
}