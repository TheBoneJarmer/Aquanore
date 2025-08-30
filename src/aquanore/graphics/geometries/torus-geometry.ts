import { Vector3 } from "../../math";
import { IndexGeometry } from "./index-geometry";

export class TorusGeometry extends IndexGeometry {
    constructor(radius: number = 1, tube: number = 0.4, radialSegments: number = 12, tubularSegments: number = 48) {
        super();

        const arc = Math.PI * 2;

        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];

        let center = new Vector3();
        let vertex = new Vector3();
        let normal = new Vector3();

        // Generate vertices, normals and UVs
        for (let j = 0; j <= radialSegments; j++) {
            for (let i = 0; i <= tubularSegments; i++) {
                const u = i / tubularSegments * arc;
                const v = j / radialSegments * Math.PI * 2;

                // Vertex
                vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                vertex.z = tube * Math.sin(v);

                vertices.push(vertex.x, vertex.y, vertex.z);

                // Normal
                center.x = radius * Math.cos(u);
                center.y = radius * Math.sin(u);

                normal = Vector3.sub(vertex, center);
                normal = Vector3.normalized(normal);
                normals.push(normal.x, normal.y, normal.z);

                // UV
                uvs.push(i / tubularSegments);
                uvs.push(j / radialSegments);
            }
        }

        // Generate indices
        for (let j = 1; j <= radialSegments; j++) {
            for (let i = 1; i <= tubularSegments; i++) {
                const a = (tubularSegments + 1) * j + i - 1;
                const b = (tubularSegments + 1) * (j - 1) + i - 1;
                const c = (tubularSegments + 1) * (j - 1) + i;
                const d = (tubularSegments + 1) * j + i;

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