import { Matrix4 } from "../math";
import { Joint } from "./joint";

export class MeshSkin {
    get joints(): Joint[];
    set joints(value: Joint[]);
    get matrices(): Matrix4[];
    set matrices(value: Matrix4);
}