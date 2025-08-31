import { Vector3 } from "../math";
import { MeshPrimitive } from "./mesh-primitive";

export class Mesh {
    private _primitives: MeshPrimitive[];
    private _translation: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;

    public get translation(): Vector3 {
        return this._translation;
    }

    public set translation(value: Vector3) {
        this._translation = value;
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

    public get primitives(): MeshPrimitive[] {
        return this._primitives;
    }

    constructor() {
        this._primitives = [];
    }
}