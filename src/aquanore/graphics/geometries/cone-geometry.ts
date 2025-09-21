import { CylinderGeometry } from "./cylinder-geometry";

export class ConeGeometry extends CylinderGeometry {
    constructor(radius: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1, openEnded: boolean = false) {
        super(0, radius, height, radialSegments, heightSegments, openEnded);
    }
}