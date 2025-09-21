import { Vector3 } from "../math";

export class Camera {
    private _position: Vector3;
    private _rotation: Vector3;
    private _fov: number;
    private _near: number;
    private _far: number;
    private _aspect: number;

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
    }

    get rotation(): Vector3 {
        return this._rotation;
    }

    set rotation(value: Vector3) {
        this._rotation = value;
    }

    get fov(): number {
        return this._fov;
    }

    set fov(value: number) {
        this._fov = value;
    }

    get near(): number {
        return this._near;
    }

    set near(value: number) {
        this._near = value;
    }

    get far(): number {
        return this._far;
    }

    set far(value: number) {
        this._far = value;
    }

    get aspect(): number {
        return this._aspect;
    }

    set aspect(value: number) {
        this._aspect = value;
    }

    constructor(fov: number, aspect: number, near: number, far: number) {
        this._position = new Vector3();
        this._rotation = new Vector3();
        this._fov = fov;
        this._near = near;
        this._far = far;
        this._aspect = aspect;
    }
}