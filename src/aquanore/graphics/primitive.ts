import { IGeometry, IMaterial } from "../interfaces";
import { Geometry } from "./geometries";

export class Primitive {
    private _material: IMaterial;
    private _geometry: IGeometry;

    get material(): IMaterial {
        return this._material;
    }

    set material(value: IMaterial) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._material = value;
    }

    get geometry(): IGeometry {
        return this._geometry;
    }

    set geometry(value: IGeometry) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._geometry = value;
    }

    constructor(geometry: IGeometry, mat: IMaterial) {
        this._geometry = geometry;
        this._material = mat;
    }
}