import { Shading } from "../enums";
import { IGeometry, IMaterial } from "../interfaces";

/**
 * "A mesh primitive is a fundamental geometric building block of a 3D mesh, representing a simple shape like a point, line, triangle, or quad. 
 * In 3D graphics file formats like glTF, mesh primitives are used to store and render parts of a larger object, holding information such as vertex positions and other attributes that define the primitive's shape and appearance for the rendering system. 
 * They can also refer to the basic, pre-made shapes like cubes, spheres, or cylinders provided by 3D software to start a new model."
 * 
 * I absolutely did _not_ shamelesly copied that from AI \*cough\* \*cough\*. But jokes aside, its a rather accurate description. 
 * Literally didn't know how to describe it myself.
 */
export class Primitive {
    private _material: IMaterial;
    private _geometry: IGeometry;
    private _castShadow: boolean;
    private _receiveShadow: boolean;

    /**
     * Returns the material
     * @returns {IMaterial}
     */
    get material(): IMaterial {
        return this._material;
    }

    /**
     * Sets the material
     * @param {IMaterial} value
     */
    set material(value: IMaterial) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._material = value;
    }

    /**
     * Returns the geometry
     * @returns {IGeometry}
     */
    get geometry(): IGeometry {
        return this._geometry;
    }

    /**
     * Sets the geometry
     * @param {IGeometry} value
     */
    set geometry(value: IGeometry) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._geometry = value;
    }

    /**
     * Returns true if the primitive is supposed to cast a shadow or false if it does not. Default is `true`.
     * @returns {boolean}
     */
    get castShadow(): boolean {
        return this._castShadow;
    }

    /**
     * If true the primitive will cast a shadow
     */
    set castShadow(value: boolean) {
        this._castShadow = value;
    }

    /**
     * Returns true if the primitive is supposed to receive shadows from other primitives. Default is `true`.
     * @returns {boolean}
     */
    get receiveShadow(): boolean {
        return this._receiveShadow;
    }

    /**
     * If true the primitive will receive shadows from other primitives.
     */
    set receiveShadow(value: boolean) {
        this._receiveShadow = value;
    }

    /**
     * Constructs a primitive from a geometry and material
     * @param geometry The geometry definition
     * @param mat The material
     */
    constructor(geometry: IGeometry, mat: IMaterial) {
        this._geometry = geometry;
        this._material = mat;
        this._castShadow = true;
        this._receiveShadow = true;
    }
}