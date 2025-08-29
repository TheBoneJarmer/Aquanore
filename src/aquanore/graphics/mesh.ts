import { IGeometry, IMaterial } from "../interfaces";
import { Vector3 } from "../math";

export class Mesh {
    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;
    private _material: IMaterial;
    private _geometry: IGeometry;

    public get position(): Vector3 {
        return this._position;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public set rotation(value: Vector3) {
        this._rotation = value;
    }

    public get scale(): Vector3 {
        return this._scale;
    }

    public set scale(value: Vector3) {
        this._scale = value;
    }

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