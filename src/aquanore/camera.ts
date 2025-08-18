import { Quaternion } from "./quaternion";
import { Vector3 } from "./vector3";

export class Camera {
    private _position: Vector3;
    private _rotation: Vector3;
    private _fov: number;
    private _near: number;
    private _far: number;
    private _aspect: number;

    public get position() {
        return this._position;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public get rotation() {
        return this._rotation;
    }

    public set rotation(value: Vector3) {
        this._rotation = value;
    }

    public get fov() {
        return this._fov;
    }

    public set fov(value: number) {
        this._fov = value;
    }

    public get near() {
        return this._near;
    }

    public set near(value: number) {
        this._near = value;
    }

    public get far() {
        return this._far;
    }

    public set far(value: number) {
        this._far = value;
    }

    public get aspect(): number {
        return this._aspect;
    }

    public set aspect(value: number) {
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