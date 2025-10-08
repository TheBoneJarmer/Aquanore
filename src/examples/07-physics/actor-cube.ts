import { RigidBodyType } from "../../aquanore/enums";
import { Model, Renderer } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Vector3 } from "../../aquanore/math";
import { Collider, RigidBody } from "../../aquanore/physics";

export class ActorCube {
    private _model: Model;
    private _body: RigidBody;
    private _collider: Collider;
    private _removed: boolean;

    get position() {
        return this._body.position;
    }

    set position(value: Vector3) {
        this._body.position = value;
    }

    get rotation() {
        return this._body.rotation;
    }

    set rotation(value: Vector3) {
        this._body.rotation = value;
    }

    get removed() {
        return this._removed;
    }

    constructor() {
        const size = 1 + Math.random() * 4;

        this._model = Model.cube(size);
        this._model.meshes.forEach((mesh) => {
            const mat = mesh.primitives[0].material as StandardMaterial;
            mat.color.r = 155 + Math.floor(Math.random() * 100);
            mat.color.g = 155 + Math.floor(Math.random() * 100);
            mat.color.b = 155 + Math.floor(Math.random() * 100);
        });
        
        this._body = new RigidBody(RigidBodyType.Dynamic);       
        this._body.mass = 100;

        this._collider = Collider.cube(size, this._body);
        this._removed = false;
    }

    public async update() {
        if (this._removed) {
            return;
        }

        const pos = this._body.position;
        const rot = this._body.rotation;

        if (pos.y < -100) {
            this._collider.remove();
            this._removed = true;
        }
    }

    public async render() {
        if (this._removed) {
            return;
        }

        Renderer.drawModel(this._model, this._body.position, this._body.rotation, Vector3.ONE);
    }
}