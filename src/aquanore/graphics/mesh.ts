import { MeshPrimitive } from "./mesh-primitive";

export class Mesh {
    private _primitives: MeshPrimitive[];

    public get primitives(): MeshPrimitive[] {
        return this._primitives;
    }

    constructor() {
        this._primitives = [];
    }
}