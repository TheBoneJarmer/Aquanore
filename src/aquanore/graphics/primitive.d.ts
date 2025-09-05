import { Material } from "./materials";
import { Geometry } from "./geometries";

export class Primitive {
    get material(): Material;
    set material(value: Material);
    get geometry(): Geometry;
    set geometry(value: Geometry);

    constructor(geometry: Geometry, mat: Material);
}