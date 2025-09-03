import { Mesh } from "./mesh";
import { MeshGroup } from "./mesh-group";

export class Model {
    get data(): Mesh | Mesh[] | MeshGroup | MeshGroup[];
    get animations(): any;

    constructor();
}