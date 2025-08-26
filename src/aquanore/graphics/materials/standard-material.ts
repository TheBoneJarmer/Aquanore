import { Color } from "../color";
import { Texture } from "../texture";
import { Material } from "./material";

export class StandardMaterial extends Material {
    private _color: Color;
    private _ambient: Color;
    private _map: Texture;

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
    }

    public get map(): Texture {
        return this._map;
    }

    public set map(value: Texture) {
        this._map = value;
    }

    public get ambient(): Color {
        return this._ambient;
    }

    public set ambient(value: Color) {
        this._ambient = value;
    }

    constructor() {
        super();
        
        this._color = new Color(255, 255, 255);
        this._ambient = new Color(55, 55, 55);
        this._map = null;
    }
}