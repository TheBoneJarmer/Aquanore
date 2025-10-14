import * as RAPIER from "@dimforge/rapier3d-compat";

import { Vector3 } from "../math";

import { Physics } from "./physics";
import { RigidBody } from "./rigidbody";
import { RapierUtils } from "./rapier-utils";

/**
 * The `Collider` class provides a wrapper around RAPIER's collider objects,
 * allowing for creation and management of various collider shapes attached to rigid bodies.
 * 
 * Use the static factory methods to create colliders of different shapes and attach them to a `RigidBody`.
 * 
 * @example
 * const body = ...; // RigidBody instance
 * const collider = Collider.sphere(1, body);
 */
export class Collider {
    private _collider: RAPIER.Collider;

    get rapierCollider(): RAPIER.Collider {
        return this._collider;
    }

    get handle(): number {
        return this._collider.handle;
    }

    get mass(): number {
        return this._collider.mass();
    }

    set mass(value: number) {
        this._collider.setMass(value);
    }

    get restitution(): number {
        return this._collider.restitution();
    }

    set restitution(value: number) {
        this._collider.setRestitution(value);
    }

    get friction(): number {
        return this._collider.friction();
    }

    set friction(value: number) {
        this._collider.setFriction(value);
    }

    constructor(collider: RAPIER.Collider) {
        this._collider = collider;
    }

    remove() {
        Physics.rapierWorld.removeCollider(this._collider, true);
    }

    raycast(origin: Vector3, direction: Vector3, maxToi: number, solid: boolean) {
        const rapOrigin = RapierUtils.fromVector3(origin);
        const rapDirection = RapierUtils.fromVector3(direction);
        const ray = new RAPIER.Ray(rapOrigin, rapDirection);
        const hit = this._collider.castRayAndGetNormal(ray, maxToi, solid);

        if (hit == null) {
            return null;
        }

        let point = RapierUtils.fromVector3(ray.pointAt(hit.timeOfImpact));
        let normal = RapierUtils.fromVector3(hit.normal);

        return {
            point: point,
            normal: normal
        };
    }

    /* FACTORY FUNCTIONS */
    /**
     * Creates a cuboid collider with equal dimensions (cube) and attaches it to the given rigid body.
     * 
     * @param size The length of each side of the cube.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the cube.
     */
    static cube(size: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a box-shaped collider and attaches it to the given rigid body.
     * 
     * @param width The width of the box.
     * @param height The height of the box.
     * @param depth The depth of the box.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the box.
     */
    static box(width: number, height: number, depth: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a spherical collider and attaches it to the given rigid body.
     * 
     * @param radius The radius of the sphere.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the sphere.
     */
    static sphere(radius: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.ball(radius);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a capsule-shaped collider and attaches it to the given rigid body.
     * 
     * @param halfHeight Half the height of the capsule (excluding the hemispherical ends).
     * @param radius The radius of the capsule's hemispherical ends.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the capsule.
     */
    static capsule(halfHeight: number, radius: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.capsule(halfHeight, radius);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a cylinder-shaped collider and attaches it to the given rigid body.
     * 
     * @param halfHeight Half the height of the cylinder.
     * @param radius The radius of the cylinder.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the cylinder.
     */
    static cylinder(halfHeight: number, radius: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.cylinder(halfHeight, radius);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a cone-shaped collider and attaches it to the given rigid body.
     * 
     * @param halfHeight Half the height of the cone.
     * @param radius The radius of the cone's base.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the cone.
     */
    static cone(halfHeight: number, radius: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.cone(halfHeight, radius);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a rounded cuboid collider and attaches it to the given rigid body.
     * 
     * @param width The width of the cuboid.
     * @param height The height of the cuboid.
     * @param depth The depth of the cuboid.
     * @param borderRadius The radius of the rounded edges.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the rounded cuboid.
     */
    static roundCuboid(width: number, height: number, depth: number, borderRadius: number, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.roundCuboid(width / 2, height / 2, depth / 2, borderRadius);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a convex hull collider from a set of points and attaches it to the given rigid body.
     * 
     * @param points The vertices defining the convex hull, as a flat Float32Array.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the convex hull.
     */
    static convexHull(points: Float32Array, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.convexHull(points)!;
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a triangle mesh collider from vertices and indices, and attaches it to the given rigid body.
     * 
     * @param vertices The vertices of the mesh, as a flat Float32Array.
     * @param indices The indices defining the mesh triangles, as a Uint32Array.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the triangle mesh.
     */
    static trimesh(vertices: Float32Array, indices: Uint32Array, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.trimesh(vertices, indices);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }

    /**
     * Creates a heightfield collider from a grid of heights and attaches it to the given rigid body.
     * 
     * @param cols The number of columns in the heightfield grid.
     * @param rows The number of rows in the heightfield grid.
     * @param heights The height values for each grid cell, as a Float32Array.
     * @param scale The scale to apply to the heightfield, as a THREE.Vector3.
     * @param body The rigid body to attach the collider to.
     * @returns A new `Collider` instance representing the heightfield.
     */
    static heightfield(cols: number, rows: number, heights: Float32Array, scale: Vector3, body: RigidBody): Collider {
        const desc = RAPIER.ColliderDesc.heightfield(rows, cols, heights, scale);
        const col = Physics.rapierWorld.createCollider(desc, body.rapierBody);

        return new Collider(col);
    }
}