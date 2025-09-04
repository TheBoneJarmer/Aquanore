import { Mesh } from "./mesh";
import { MeshJoint } from "./mesh-joint";

export class Model {
    get data(): Mesh | Mesh[] | MeshJoint | MeshJoint[];
    get animations(): any;

    constructor();
}