import { Keys, RigidBodyType } from "../../aquanore/enums";
import { Model, Renderer, Scene } from "../../aquanore/graphics";
import { Joystick, Keyboard } from "../../aquanore/input";
import { MathHelper, Vector2, Vector3 } from "../../aquanore/math";
import { Collider, Physics, RigidBody } from "../../aquanore/physics";

export class ActorPlayer {
    private _model: Model;
    private _body: RigidBody;
    private _collider: Collider;

    constructor() {
        this._model = Model.sphere(1);

        this._body = new RigidBody(RigidBodyType.Dynamic);
        this._body.position = new Vector3(0, 2, 0);
        this._body.gravity = 4;

        this._collider = Collider.sphere(1, this._body);
        this._collider.restitution = 0.25;
    }

    async update(dt: number) {
        this.updateCamera(dt);
        this.updateControls(dt);
    }

    private updateCamera(dt: number) {
        const pos = this._body.position;

        Scene.camera.translation = new Vector3(-pos.x, pos.y + 5, -pos.z - 10);
        Scene.camera.rotation = new Vector3(MathHelper.radians(25), 0, 0);
    }

    private updateControls(dt: number) {
        const pos = this._body.position;
        const rot = this._body.rotation;

        if (Joystick.isConnected(0)) {
            const v = new Vector3();
            v.x += Joystick.getAxis(0, 0);
            v.z += Joystick.getAxis(0, 1);

            this._body.impulse(new Vector3(v.x, v.y, v.z));
        } else {
            const up = Keyboard.keyDown(Keys.Up) || Keyboard.keyDown(Keys.W);
            const down = Keyboard.keyDown(Keys.Down) || Keyboard.keyDown(Keys.S);
            const left = Keyboard.keyDown(Keys.Left) || Keyboard.keyDown(Keys.A);
            const right = Keyboard.keyDown(Keys.Right) || Keyboard.keyDown(Keys.D);
            const jump = Keyboard.keyPressed(Keys.Space);

            if (up) this._body.impulse(Vector3.BACKWARD);
            if (down) this._body.impulse(Vector3.FORWARD);
            if (left) this._body.impulse(Vector3.LEFT);
            if (right) this._body.impulse(Vector3.RIGHT);

            if (jump) {
                this._body.impulse(new Vector3(0, 100, 0));
            }
        }

        if (pos.y < -6) {
            pos.x = 0;
            pos.y = 2;
            pos.z = 0;

            this._body.linearVelocity = new Vector3(0, 0, 0);
            this._body.angularVelocity = new Vector3(0,0,0);
            this._body.position = new Vector3(0, 2, 0);
            this._body.rotation = new Vector3(0, 0, 0);
        }

        if (Keyboard.keyPressed(Keys.G)) {
            if (Physics.gravity.y == 0) {
                Physics.gravity = new Vector3(0, -10, 0);
            } else {
                Physics.gravity = new Vector3(0, 0, 0);
            }
        }
    }

    async render() {
        Renderer.drawModel(this._model, this._body.position, this._body.rotation, Vector3.ONE);
    }
}