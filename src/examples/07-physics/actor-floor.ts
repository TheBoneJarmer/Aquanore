import { RigidBodyType } from "../../aquanore/enums";
import { Color, Model, Renderer } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Vector3 } from "../../aquanore/math";
import { Collider, RigidBody } from "../../aquanore/physics";

export class ActorFloor {
    private _model: Model;
    private _body: RigidBody;
    private _collider: Collider;

    constructor() {
        const width = 10;
        const height = 0.5;
        const depth = 10;

        this._model = Model.box(width, height, depth);
        this._model.meshes.forEach((mesh) => {
            const mat = mesh.primitives[0].material as StandardMaterial;
            mat.color = new Color(35, 185, 35);
        });

        this._body = new RigidBody(RigidBodyType.STATIC);
        this._collider = Collider.box(width, height, depth, this._body);
    }

    public async render() {
        Renderer.drawModel(this._model, this._body.position, this._body.rotation, Vector3.ONE);
    }
}