import { Mesh } from "./mesh";
import { Joint } from "./joint";
import { ModelAnimation } from "./model-animation";
import { MeshSkin } from "./mesh-skin";

export class Model {
    get meshes(): Mesh[];
    set meshes(value: Mesh[]);
    get joints(): Joint[];
    set joints(value: Joint[]);
    get animations(): ModelAnimation[];
    set animations(value: ModelAnimation[]);
    get skins(): MeshSkin[];
    set skins(value: MeshSkin[]);

    constructor();
}