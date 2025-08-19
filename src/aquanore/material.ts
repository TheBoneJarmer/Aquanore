import { Color } from "./color";
import { Texture } from "./texture";

export class Material {
    private _diffuse: Color;
    private _diffuseMap: Texture;
    private _ambient: Color;
    private _ambientMap: Texture;
    private _specular: Color;
    private _specularMap: Texture;

    get diffuse(): Color {
        return this._diffuse;
    }
    set diffuse(value: Color) {
        this._diffuse = value;
    }

    get ambient(): Color {
        return this._ambient;
    }
    set ambient(value: Color) {
        this._ambient = value;
    }

    get specular(): Color {
        return this._specular;
    }
    set specular(value: Color) {
        this._specular = value;
    }

    get diffuseMap(): Texture {
        return this._diffuseMap;
    }
    set diffuseMap(value: Texture) {
        this._diffuseMap = value;
    }

    get ambientMap(): Texture {
        return this._ambientMap;
    }
    set ambientMap(value: Texture) {
        this._ambientMap = value;
    }

    get specularMap(): Texture {
        return this._specularMap;
    }
    set specularMap(value: Texture) {
        this._specularMap = value;
    }

    constructor() {
        this._diffuse = new Color(255,255,255,255);
        this._diffuseMap = null;
        this._specular = new Color(125,125,125,255);
        this._specularMap = null;
        this._ambient = new Color(55,55,55,255);
        this._ambientMap = null;
    }
}