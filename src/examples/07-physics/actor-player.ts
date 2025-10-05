import { Keys, RigidBodyType } from "../../aquanore/enums";
import { Model, Renderer, Scene } from "../../aquanore/graphics";
import { Joystick, Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { Collider, RigidBody } from "../../aquanore/physics";

export class ActorPlayer {
    private _model: Model;
    private _body: RigidBody;
    private _collider: Collider;

    private _velocity: Vector3;

    constructor() {
        this._model = Model.sphere(1);

        this._body = new RigidBody(RigidBodyType.DYNAMIC);
        this._body.position = new Vector3(0, 2, 0);

        this._collider = Collider.sphere(1, this._body);

        this._velocity = new Vector3(0, 0, 0);
    }

    async update(dt: number) {
        this.updateCamera(dt);
        this.updateVelocity(dt);
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
        const speed = 0.25;

        if (Joystick.isConnected(0)) {
            this._velocity.x += Joystick.getAxis(0, 0) * speed;
            this._velocity.z += Joystick.getAxis(0, 1) * speed;
        } else {
            const up = Keyboard.keyDown(Keys.Up) || Keyboard.keyDown(Keys.W);
            const down = Keyboard.keyDown(Keys.Down) || Keyboard.keyDown(Keys.S);
            const left = Keyboard.keyDown(Keys.Left) || Keyboard.keyDown(Keys.A);
            const right = Keyboard.keyDown(Keys.Right) || Keyboard.keyDown(Keys.D);

            if (up) this._velocity.z -= speed;
            if (down) this._velocity.z += speed;
            if (left) this._velocity.x -= speed;
            if (right) this._velocity.x += speed;
        }

        if (pos.y < -6) {
            pos.x = 0;
            pos.y = 2;
            pos.z = 0;

            this._velocity.x = 0;
            this._velocity.z = 0;

            this._body.rapierBody.resetForces(true);
            this._body.rapierBody.resetTorques(true);
        }

        this._body.position = pos;
        this._body.rotation = rot;
    }

    private updateVelocity(dt: number) {
        const minSpeed = -10;
        const maxSpeed = 10;

        this._velocity.x = MathHelper.clamp(this._velocity.x, minSpeed, maxSpeed);
        this._velocity.z = MathHelper.clamp(this._velocity.z, minSpeed, maxSpeed);

        if (this._velocity.x > dt) {
            this._velocity.x -= 0.1;
        } else if (this._velocity.x < -dt) {
            this._velocity.x += 0.1;
        } else {
            this._velocity.x = 0;
        }

        if (this._velocity.z > dt) {
            this._velocity.z -= 0.1;
        } else if (this._velocity.z < -dt) {
            this._velocity.z += 0.1;
        } else {
            this._velocity.z = 0;
        }

        const pos = this._body.position;
        pos.x += this._velocity.x * dt;
        pos.z += this._velocity.z * dt;

        this._body.position = pos;
    }

    async render() {
        Renderer.drawModel(this._model, this._body.position, this._body.rotation, Vector3.ONE);
    }
}