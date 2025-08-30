import { Vector2, Vector3 } from "../../math";
import { IndexGeometry } from "./index-geometry";

export class RingGeometry extends IndexGeometry {
    constructor(innerRadius: number = 0.5, outerRadius: number = 1, thetaSegments: number = 32, phiSegments: number = 1) {
        super();

        const thetaStart = 0;
        const thetaLength = Math.PI * 2;
        const radiusStep = ((outerRadius - innerRadius) / phiSegments);

        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];
        let radius = innerRadius;

        let vertex = new Vector3();
        let uv = new Vector2();

        // Generate vertices, normals and UVs
        for (let j = 0; j <= phiSegments; j++) {
            for (let i = 0; i <= thetaSegments; i++) {
                const segment = thetaStart + i / thetaSegments * thetaLength;

                // Vertex
                vertex.x = radius * Math.cos(segment);
                vertex.y = radius * Math.sin(segment);

                vertices.push(vertex.x, vertex.y, vertex.z);

                // Normal
                normals.push(0, 0, 1);

                // UV
                uv.x = (vertex.x / outerRadius + 1) / 2;
                uv.y = (vertex.y / outerRadius + 1) / 2;

                uvs.push(uv.x, uv.y);
            }

            radius += radiusStep;
        }

        // Indices
        for (let j = 0; j < phiSegments; j++) {
            const thetaSegmentLevel = j * (thetaSegments + 1);

            for (let i = 0; i < thetaSegments; i++) {
                const segment = i + thetaSegmentLevel;
                const a = segment;
                const b = segment + thetaSegments + 1;
                const c = segment + thetaSegments + 2;
                const d = segment + 1;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        this._vertices = vertices;
        this._normals = normals;
        this._uvs = uvs;
        this._indices = indices;

        this.generateTangents();
        this.generateBuffers();
    }
}