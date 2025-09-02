import { Vector3 } from "../math";

export class Camera {
    get position(): Vector3;
    set position(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
    get fov(): number;
    set fov(value: number);
    get near(): number;
    set near(value: number);
    get far(): number;
    set far(value: number);
    get aspect(): number;
    set aspect(value: number);

    constructor(fov: number, aspect: number, near: number, far: number);
}