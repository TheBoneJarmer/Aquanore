import { Vector3 } from "../math";
import { Primitive } from "./primitive";

export class Mesh {
    private _translation: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;
    private _primitives: Primitive[];
    private _name: string;
    private _index: number;
    private _parent: number | null;
    private _skin: number | null;

    get translation(): Vector3 {
        return this._translation;
    }

    set translation(value: Vector3) {
        this._translation = value;
    }

    get rotation(): Vector3 {
        return this._rotation;
    }

    set rotation(value: Vector3) {
        this._rotation = value;
    }

    get scale(): Vector3 {
        return this._scale;
    }

    set scale(value: Vector3) {
        this._scale = value;
    }

    get primitives(): Primitive[] {
        return this._primitives;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get index(): number {
        return this._index;
    }

    set index(value: number) {
        this._index = value;
    }

    get parent(): number | null {
        return this._parent;
    }

    set parent(value: number | null) {
        this._parent = value;
    }

    get skin(): number | null {
        return this._skin;
    }

    set skin(value: number | null) {
        this._skin = value;
    }

    constructor() {
        this._translation = new Vector3(0, 0, 0);
        this._rotation = new Vector3(0, 0, 0);
        this._scale = new Vector3(1, 1, 1);
        this._primitives = [];
        this._name = "Mesh";
        this._index = 0;
        this._parent = null;
        this._skin = null;
    }
}