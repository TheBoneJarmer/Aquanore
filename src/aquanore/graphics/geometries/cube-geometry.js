import { BoxGeometry } from "./box-geometry";

export class CubeGeometry extends BoxGeometry {
    constructor(size = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        super(size, size, size, widthSegments, heightSegments, depthSegments);
    }
}