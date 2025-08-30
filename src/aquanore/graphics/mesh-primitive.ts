import { IGeometry, IMaterial } from "../interfaces";

export class MeshPrimitive {
    private _material: IMaterial;
    private _geometry: IGeometry;

    public get material(): IMaterial {
        return this._material;
    }

    public set material(value: IMaterial) {
        if (value == null) {
            throw new Error("Material cannot be null");
        }

        this._material = value;
    }

    public get geometry(): IGeometry {
        return this._geometry;
    }

    public set geometry(value: IGeometry) {
        this._geometry = value;
    }

    public constructor(geometry: IGeometry, mat: IMaterial) {
        this._geometry = geometry;
        this._material = mat;
    }
}