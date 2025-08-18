import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

export class Shaders {
    private static _polygon: Shader;
    private static _model: Shader;

    public static get polygon(): Shader {
        return this._polygon;
    }

    public static get model(): Shader {
        return this._model;
    }

    public static init() {
        this._polygon = new Shader(ShaderSources.POLYGON_V, ShaderSources.POLYGON_F);
        this._model = new Shader(ShaderSources.MODEL_V, ShaderSources.MODEL_F);
    }
}