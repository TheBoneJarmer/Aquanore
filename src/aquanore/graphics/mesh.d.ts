import { Vector3 } from "../math";
import { MeshPrimitive } from "./mesh-primitive";

export class Mesh {
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
    get scale(): Vector3;
    set scale(value: Vector3);
    get primitives(): MeshPrimitive[];

    constructor();
}