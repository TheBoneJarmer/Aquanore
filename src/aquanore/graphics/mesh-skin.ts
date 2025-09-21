import { Matrix4 } from "../math";
import { Joint } from "./joint";

export class MeshSkin {
    private _joints: number[];
    private _matrices: Matrix4[];

    get joints(): number[] {
        return this._joints;
    }

    set joints(value: number[]) {
        this._joints = value;
    }

    get matrices(): Matrix4[] {
        return this._matrices;
    }

    set matrices(value: Matrix4[]) {
        this._matrices = value;
    }

    constructor() {
        this._joints = [];
        this._matrices = [];
    }
}