import * as RAPIER from "@dimforge/rapier3d-compat";
import { Vector3 } from "../math";
import { RapierUtils } from "./rapier-utils";

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
    public static get rapierWorld(): RAPIER.World {
        return this._world;
    }

    public static get gravity(): Vector3 {
        return RapierUtils.fromVector3(this._world.gravity);
    }

    public static set gravity(value: Vector3) {
        this._world.gravity = RapierUtils.toVector3(value);
    }

    public static raycast(origin: Vector3, direction: Vector3, maxToi: number, solid: boolean) {
        const rapOrigin = RapierUtils.fromVector3(origin);
        const rapDirection = RapierUtils.fromVector3(direction);
        const ray = new RAPIER.Ray(rapOrigin, rapDirection);
        const hit = this._world.castRayAndGetNormal(ray, maxToi, solid);

        if (hit == null) {
            return null;
        }

        let handle = hit.collider.handle;
        let point = RapierUtils.fromVector3(ray.pointAt(hit.timeOfImpact));
        let normal = RapierUtils.fromVector3(hit.normal);

        return {
            handle: handle,
            point: point,
            normal: normal
        };
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