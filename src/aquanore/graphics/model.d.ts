import { Mesh } from "./mesh";
import { Joint } from "./joint";
import { ModelAnimation } from "./model-animation";
import { MeshSkin } from "./mesh-skin";

export type ModelData = (Mesh | Joint)[];

export class Model {
    get data(): ModelData;
    set data(value: ModelData);
    get animations(): ModelAnimation[];
    set animations(value: ModelAnimation[]);
    get skins(): MeshSkin[];
    set skins(value: MeshSkin[]);

    constructor();
}