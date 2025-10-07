import * as RAPIER from "@dimforge/rapier3d-compat";

import { Quaternion, Vector3 } from "../math";

import { Physics } from "./physics";
import { RigidBodyType } from "../enums";

/**
 * Represents a wrapper around a Rapier physics engine rigid body,
 * providing convenient accessors and mutators for position and rotation
 * using js types.
 *
 * @remarks
 * This class abstracts the underlying Rapier rigid body and exposes
 * its position and rotation as Vector3 and Euler respectively.
 * It also handles conversion between Rapier and js types.
 *
 * @example
 * ```typescript
 * const rb = new RigidBody(RigidBodyType.DYNAMIC);
 * rb.position = new Vector3(1, 2, 3);
 * rb.rotation = new Euler(Math.PI / 2, 0, 0);
 * ```
 *
 * @see {@link RAPIER.RigidBody}
 * @see {@link Vector3}
 * @see {@link Euler}
 */
export class RigidBody {
    private _body: RAPIER.RigidBody;

    /**
     * Gets the underlying Rapier rigid body instance associated with this object.
     * 
     * @returns The current rapier rigidbody instance.
     */
    public get rapierBody(): RAPIER.RigidBody {
        return this._body;
    }

    /**
     * Gets the current position of the rigid body as a Vector3.
     * The position is retrieved from the underlying physics body's translation.
     *
     * @returns {Vector3} The position vector (x, y, z) of the rigid body.
     */
    public get position(): Vector3 {
        const t = this._body.translation();
        return new Vector3(t.x, t.y, t.z);
    }

    /**
     * Sets the position of the rigid body in the physics simulation.
     * 
     * @remarks
     * Converts the provided Vector3 position to a RAPIER.Vector3 and updates the body's translation.
     * 
     * @param value The new position as a Vector3.
     */
    public set position(value: Vector3) {
        const tra = new RAPIER.Vector3(value.x, value.y, value.z);
        this._body.setTranslation(tra, true);
    }

    /**
     * Gets the current rotation of the rigid body as a Euler object.
     *
     * The rotation is retrieved from the underlying physics body as a quaternion,
     * which is then converted to Euler angles using js utilities.
     *
     * @returns {Vector3} The rotation of the rigid body in Euler angles.
     */
    public get rotation(): Vector3 {
        const rot = this._body.rotation();
        const q = new Quaternion(rot.x, rot.y, rot.z, rot.w);

        return Quaternion.toEuler(q);
    }

    /**
     * Sets the rotation of the rigid body using a Euler value.
     * Converts the Euler rotation to a quaternion and applies it to the underlying physics body.
     *
     * @param value The new rotation as a Euler instance.
     */
    public set rotation(value: Vector3) {
        const q = Quaternion.fromEuler(value);
        const rot = new RAPIER.Quaternion(q.x, q.y, q.z, q.w);
        
        this._body.setRotation(rot, true);
    }

    public get linearVelocity(): Vector3 {
        const v = this._body.linvel();
        return new Vector3(v.x, v.y, v.z);
    }

    public set linearVelocity(value: Vector3) {
        const v = new RAPIER.Vector3(value.x, value.y, value.z);
        this._body.setLinvel(v, true);
    }

    public get angularVelocity(): Vector3 {
        const v = this._body.angvel();
        return new Vector3(v.x, v.y, v.z);
    }

    public set angularVelocity(value: Vector3) {
        const v = new RAPIER.Vector3(value.x, value.y, value.z);        
        this._body.setAngvel(v, true);
    }

    /**
     * Creates a new rigid body instance of the specified type.
     * 
     * Initializes the rigid body description based on the provided `type`.
     * If the type is `RigidBodyType.DYNAMIC`, a dynamic rigid body is created;
     * otherwise, a fixed rigid body is created. The rigid body is then added to the physics world.
     * 
     * @param type The type of the rigid body to create (dynamic or fixed).
     */
    constructor(type: RigidBodyType) {
        let desc: RAPIER.RigidBodyDesc;

        if (type == RigidBodyType.Dynamic) {
            desc = RAPIER.RigidBodyDesc.dynamic();
        } else if (type == RigidBodyType.Static) {
            desc = RAPIER.RigidBodyDesc.fixed();
        } else if (type == RigidBodyType.KinematicPosition) {
            desc = RAPIER.RigidBodyDesc.kinematicPositionBased();
        } else {
            desc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
        }

        this._body = Physics.world.createRigidBody(desc);
    }

    /**
     * Removes this rigid body from the physics world.
     *
     * This method unregisters the associated physics body from the global `Physics.world`,
     * effectively disabling its simulation and interactions.
     */
    public remove() {
        Physics.world.removeRigidBody(this._body);
    }

    public impulse(value: Vector3) {
        const v = new RAPIER.Vector3(value.x, value.y, value.z);
        this._body.applyImpulse(v, true);
    }
}