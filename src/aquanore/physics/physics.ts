import * as RAPIER from "@dimforge/rapier3d-compat";
import { Vector3 } from "../math";

/**
 * The `Physics` class provides a static interface for initializing and managing a physics simulation world
 * using the Rapier physics engine. It encapsulates the creation, access, and update of the physics world,
 * allowing for easy integration into applications that require physics simulation.
 *
 * @remarks
 * - The class is designed to be used statically; all methods and properties are static.
 * - The physics world is initialized with a default gravity vector of (0, -10, 0).
 * - The `init` method must be called before accessing or updating the physics world.
 *
 * @example
 * ```typescript
 * await Physics.init();
 * Physics.update(deltaTime);
 * const world = Physics.world;
 * ```
 */
export class Physics {
    private static _world: RAPIER.World;

    /**
     * Gets the current physics simulation world.
     *
     * @returns The instance of a Rapier world representing the physics world.
     */
    public static get world(): RAPIER.World {
        return this._world;
    }

    public static get gravity(): Vector3 {
        const v = this._world.gravity;
        const value = new Vector3(v.x, v.y, v.z);

        return value;
    }

    public static set gravity(value: Vector3) {
        const v = new RAPIER.Vector3(value.x, value.y, value.z);
        this._world.gravity = v;
    }

    /* INTERNAL FUNCTIONS */
    public static async __init() {
        await RAPIER.init();

        const gravity = new RAPIER.Vector3(0, -10, 0);
        this._world = new RAPIER.World(gravity);
    }

    public static async __update() {
        this._world.step();
    }
}