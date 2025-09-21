import { ICamera } from "../interfaces";
import { Vector3 } from "../math";

export class OrthoCamera implements ICamera {
    private _translation: Vector3;
    private _rotation: Vector3;
    private _left: number;
    private _right: number;
    private _top: number;
    private _bottom: number;
    private _near: number;
    private _far: number;

    /**
     * Gets the left plane of the orthographic camera.
     * @returns {number}
     */
    get left(): number {
        return this._left;
    }

    /**
     * Sets the left plane of the orthographic camera.
     * @param {number} value
     */
    set left(value: number) {
        this._left = value;
    }

    /**
     * Gets the right plane of the orthographic camera.
     * @returns {number}
     */
    get right(): number {
        return this._right;
    }

    /**
     * Sets the right plane of the orthographic camera.
     * @param {number} value
     */
    set right(value: number) {
        this._right = value;
    }

    /**
     * Gets the top plane of the orthographic camera.
     * @returns {number}
     */
    get top(): number {
        return this._top;
    }

    /**
     * Sets the top plane of the orthographic camera.
     * @param {number} value
     */
    set top(value: number) {
        this._top = value;
    }

    /**
     * Gets the bottom plane of the orthographic camera.
     * @returns {number}
     */
    get bottom(): number {
        return this._bottom;
    }

    /**
     * Sets the bottom plane of the orthographic camera.
     * @param {number} value
     */
    set bottom(value: number) {
        this._bottom = value;
    }

    /**
     * Gets the near plane of the orthographic camera.
     * @returns {number}
     */
    get near(): number {
        return this._near;
    }

    /**
     * Sets the near plane of the orthographic camera.
     * @param {number} value
     */
    set near(value: number) {
        this._near = value;
    }

    /**
     * Gets the far plane of the orthographic camera.
     * @returns {number}
     */
    get far(): number {
        return this._far;
    }

    /**
     * Sets the far plane of the orthographic camera.
     * @param {number} value
     */
    set far(value: number) {
        this._far = value;
    }

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
     * Constructs the orthographic camera
     * @param {number} left Left plane
     * @param {number} right Right plane
     * @param {number} top Top plane
     * @param {number} bottom Bottom plane
     * @param {number} near Near plane
     * @param {number} far Far plane
     */
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number) {
        this._translation = new Vector3();
        this._rotation = new Vector3();
        this._left = left;
        this._right = right;
        this._top = top;
        this._bottom = bottom;
        this._near = near;
        this._far = far;
    }
}