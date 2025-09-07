import { Vector3 } from "../math";

export class Joint {
    get children(): number[];
    set children(value: number[]);
    get name(): string;
    set name(value: string);
    get translation(): Vector3;
    set translation(value: Vector3);
    get rotation(): Vector3;
    set rotation(value: Vector3);
    get scale(): Vector3;
    set scale(value: Vector3);
    get parent(): number;
    set parent(value: number);
    get index(): number;
    set index(value: number);

    constructor();
}