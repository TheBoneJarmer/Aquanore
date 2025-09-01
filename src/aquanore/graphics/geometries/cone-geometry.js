import { CylinderGeometry } from "./cylinder-geometry";

export class ConeGeometry extends CylinderGeometry {
    constructor(radius = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
        super(0, radius, height, radialSegments, heightSegments, openEnded);
    }
}