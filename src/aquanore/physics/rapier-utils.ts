import * as RAPIER from "@dimforge/rapier3d-compat";

import { Quaternion, Vector3 } from "../math";

export class RapierUtils {
    /**
     * Converts a `Vector3` object of Aquanore to a `Vector3` object from Rapier
     * @param v Our vector3 object
     * @returns A rapier vector3 object
     */
    public static toVector3(v: Vector3): RAPIER.Vector3 {
        return new RAPIER.Vector3(v.x, v.y, v.z);
    }

    /**
     * Converts a `Vector3` object from Rapier to a `Vector3` object from Aquanore
     * @param v The Rapier vector3 object
     * @returns A vector3 object
     */
    public static fromVector3(v: RAPIER.Vector3): Vector3 {
        return new Vector3(v.x, v.y, v.z);
    }

    /**
     * Converts a `Quaternion` object from us to a `Quaternion` object from Rapier
     * @param q Our quaternion object
     * @returns A Rapier quaternion object
     */
    public static toQuaternion(q: Quaternion): RAPIER.Quaternion {
        return new RAPIER.Quaternion(q.x, q.y, q.z, q.w);
    }

    /**
     * Converts a `Quaternion` object from Rapier to a `Quaternion` object from Aquanore
     * @param q The Rapier quaternion object
     * @returns A quaternion object
     */
    public static fromQuaternion(q: RAPIER.Quaternion): Quaternion {
        return new Quaternion(q.x, q.y, q.z, q.w);
    }

    /**
     * Converts a `Quaternion` object from Rapier to a `Euler Vector3` object from Aquanore
     * @param q The Rapier quaternion object
     * @returns A vector3 object
     */
    public static toEuler(q: RAPIER.Quaternion): Vector3 {
        return Quaternion.toEuler(this.fromQuaternion(q));
    }

    /**
     * Converts a `Euler Vector3` object from Aquanore to a `Quaternion` object from Rapier
     * @param v Our vector3 object
     * @returns The Rapier quaternion object
     */
    public static fromEuler(v: Vector3): RAPIER.Quaternion {
        return this.toQuaternion(Quaternion.fromEuler(v));
    }
}