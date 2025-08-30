import { Mesh } from "./mesh";

export class Model {
    private _meshes: Mesh[];

    get meshes(): Mesh[] {
        return this._meshes;
    }

    constructor() {
        this._meshes = [];
    }
}