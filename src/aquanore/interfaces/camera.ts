import { Vector3 } from "../math";

export interface ICamera {
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
}