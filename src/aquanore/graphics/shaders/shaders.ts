import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

export class Shaders {
    private static _polygon: Shader;
    private static _model: Shader;

    static get polygon() {
        return this._polygon;
    }

    static get model() {
        return this._model;
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this._polygon = new Shader(ShaderSources.POLYGON_V, ShaderSources.POLYGON_F);
        this._model = new Shader(ShaderSources.MODEL_V, ShaderSources.MODEL_F);
    }
}