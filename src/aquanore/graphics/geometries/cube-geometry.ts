import { BoxGeometry } from "./box-geometry";

export class CubeGeometry extends BoxGeometry {
    constructor(size: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1) {
        super(size, size, size, widthSegments, heightSegments, depthSegments);
    }
}