import { ICamera } from "../interfaces";
import { Matrix4, Vector3 } from "../math";

export class PerspectiveCamera implements ICamera {
    private _translation: Vector3;
    private _rotation: Vector3;
    private _fov: number;
    private _near: number;
    private _far: number;
    private _aspect: number;
    private _target: Vector3;

    /**
     * Returns the camera's translation
     * @returns {Vector3}
     */
    get translation(): Vector3 {
        return this._translation;
    }

    /**
     * Sets the camera's translation
     * @param {Vector3} value
     */
    set translation(value: Vector3) {
        this._translation = value;
    }

    /**
     * Returns the camera's rotation as euler angles
     * @returns {Vector3}
     */
    get rotation(): Vector3 {
        return this._rotation;
    }

    /**
     * Sets the camera's rotation. Value is expected to be in euler angles.
     * @param {Vector3} value
     */
    set rotation(value: Vector3) {
        this._rotation = value;
    }

    /**
     * Returns the camera's field of view
     * @returns {number}
     */
    get fov(): number {
        return this._fov;
    }

    /**
     * Sets the camera's field of view
     * @param {number} value
     */
    set fov(value: number) {
        this._fov = value;
    }

    /**
     * Returns the camera's near plane
     * @returns {number}
     */
    get near(): number {
        return this._near;
    }

    /**
     * Sets the camera's near plane
     * @param {number} value
     */
    set near(value: number) {
        this._near = value;
    }

    /**
     * Returns the camera's far plane
     * @returns {number}
     */
    get far(): number {
        return this._far;
    }

    /**
     * Sets the camera's far plane
     * @param {number} value
     */
    set far(value: number) {
        this._far = value;
    }

    /**
     * Returns the camera's aspect ratio.
     * @returns {number}
     */
    get aspect(): number {
        return this._aspect;
    }

    /**
     * Sets the camera's aspect ratio. You do _not_ need to do this manually for the `Scene` class already does this for you.
     * @param {number} value
     */
    set aspect(value: number) {
        this._aspect = value;
    }

    get projectionMatrix(): Matrix4 {
        const fov = this._fov;
        const near = this._near;
        const far = this._far;
        const aspect = this._aspect;

        return Matrix4.perspective(fov, aspect, near, far);
    }

    get viewMatrix(): Matrix4 {
        if (this._target == null) {
            const pos = this._translation;
            const rot = this._rotation;

            let m = Matrix4.identity();
            m = Matrix4.rotate(m, rot.x, rot.y, rot.z);
            m = Matrix4.translate(m, pos.x, -pos.y, pos.z);

            return m;
        } else {
            return Matrix4.lookAt(this._translation, this._target, Vector3.UP);
        }
    }

    /**
     * Constructs a perspective camera
     * @param fov Field Of View
     * @param aspect Aspect ratio
     * @param near Near plane
     * @param far Far plane
     */
    constructor(fov: number, aspect: number, near: number, far: number) {
        this._translation = new Vector3();
        this._rotation = new Vector3();
        this._fov = fov;
        this._near = near;
        this._far = far;
        this._aspect = aspect;
        this._target = null;
    }

    lookAt(target: Vector3 | null): void {
        this._target = target;
    }
}