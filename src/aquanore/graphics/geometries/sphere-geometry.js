import { Vector3 } from "../../math";
import { Geometry } from "./geometry";

export class SphereGeometry extends Geometry {
    constructor(radius = 1, widthSegments = 32, heightSegments = 16) {
        super();

        let index = 0;
        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];
        let vertex = new Vector3();
        let normal = new Vector3();
        let grid = [];

        const phiStart = 0;
        const phiLength = Math.PI * 2;
        const thetaStart = 0;
        const thetaLength = Math.PI;
        const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

        widthSegments = Math.max(3, Math.floor(widthSegments));
        heightSegments = Math.max(2, Math.floor(heightSegments));

        for (let iy = 0; iy <= heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / heightSegments;

            // Special case for the poles
            let uOffset = 0;

            if (iy === 0 && thetaStart === 0) {
                uOffset = 0.5 / widthSegments;
            } else if (iy === heightSegments && thetaEnd === Math.PI) {
                uOffset = - 0.5 / widthSegments;
            }

            for (let ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;

                // Vertex
                vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

                vertices.push(vertex.x, vertex.y, vertex.z);

                // Normal
                normal = vertex.clone();
                normal = Vector3.normalized(normal);
                normals.push(normal.x, normal.y, normal.z);

                // UV
                uvs.push(u + uOffset, 1 - v);

                verticesRow.push(index++);
            }

            grid.push(verticesRow);
        }

        // Generate indices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];

                if (iy !== 0 || thetaStart > 0) {
                    indices.push(a, b, d);
                }

                if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
                    indices.push(b, c, d);
                }
            }
        }

        this.vertices = vertices;
        this.normals = normals;
        this.uvs = uvs;
        this.indices = indices;

        this.generateTangents();
        this.generateBuffers();
    }
}