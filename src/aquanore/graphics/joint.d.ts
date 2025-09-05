import { Vector3 } from "../math";
import { Mesh } from "./mesh";

export class Joint {
    get children(): (Mesh | Joint)[];
    get name(): string;
    set name(value: string);
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
    get scale(): Vector3;
    set scale(value: Vector3);

    constructor();
}