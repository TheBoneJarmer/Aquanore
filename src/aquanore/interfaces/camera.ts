import { Matrix4, Vector3 } from "../math";

export interface ICamera {
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);

    get projectionMatrix(): Matrix4;
    get viewMatrix(): Matrix4;
    get worldMatrix(): Matrix4;
    
    lookAt(target: Vector3 | null): void;
}