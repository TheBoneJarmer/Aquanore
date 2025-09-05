import { Vector3 } from "../math";
import { MeshSkin } from "./mesh-skin";
import { Primitive } from "./primitive";

export class Mesh {
    get primitives(): Primitive[];
    get name(): string;
    set name(value: string);
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
    get scale(): Vector3;
    set scale(value: Vector3);
    get skin(): MeshSkin;
    set skin(value: MeshSkin);

    constructor();
}