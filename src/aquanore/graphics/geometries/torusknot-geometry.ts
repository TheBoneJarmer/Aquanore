import { Vector3 } from '../../math';
import { IndexGeometry } from './index-geometry';

export class TorusKnotGeometry extends IndexGeometry {
    constructor(radius: number = 1, tube: number = 0.4, tubularSegments: number = 64, radialSegments: number = 8, p: number = 2, q: number = 3) {
        super();

        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];

        let P1 = new Vector3();
        let P2 = new Vector3();
        let B = new Vector3();
        let T = new Vector3();
        let N = new Vector3();
        let vertex = new Vector3();
        let normal = new Vector3();

        // Generate vertices, normals and UVs
        for (let i = 0; i <= tubularSegments; ++i) {
            const u = i / tubularSegments * p * Math.PI * 2;

            P1 = this.calculatePositionOnCurve(u, p, q, radius);
            P2 = this.calculatePositionOnCurve(u + 0.01, p, q, radius);

            // Calculate orthonormal basis
            T = Vector3.sub(P2, P1);
            N = Vector3.add(P2, P1);
            B = Vector3.normalized(Vector3.cross(T, N));
            N = Vector3.normalized(Vector3.cross(B, T));

            for (let j = 0; j <= radialSegments; ++j) {
                const v = j / radialSegments * Math.PI * 2;
                const cx = - tube * Math.cos(v);
                const cy = tube * Math.sin(v);

                vertex.x = P1.x + (cx * N.x + cy * B.x);
                vertex.y = P1.y + (cx * N.y + cy * B.y);
                vertex.z = P1.z + (cx * N.z + cy * B.z);

                vertices.push(vertex.x, vertex.y, vertex.z);

                normal = Vector3.sub(vertex, P1);
                normal = Vector3.normalized(normal);
                normals.push(normal.x, normal.y, normal.z);

                uvs.push(i / tubularSegments);
                uvs.push(j / radialSegments);
            }
        }

        // Generate indices
        for (let j = 1; j <= tubularSegments; j++) {
            for (let i = 1; i <= radialSegments; i++) {
                const a = (radialSegments + 1) * (j - 1) + (i - 1);
                const b = (radialSegments + 1) * j + (i - 1);
                const c = (radialSegments + 1) * j + i;
                const d = (radialSegments + 1) * (j - 1) + i;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        this._vertices = vertices;
        this._normals = normals;
        this._uvs = uvs;
        this._indices = indices;

        this.generateBuffers();
    }

    private calculatePositionOnCurve(u: number, p: number, q: number, radius: number): Vector3 {
        const cu = Math.cos(u);
        const su = Math.sin(u);
        const quOverP = q / p * u;
        const cs = Math.cos(quOverP);

        const result = new Vector3();
        result.x = radius * (2 + cs) * 0.5 * cu;
        result.y = radius * (2 + cs) * su * 0.5;
        result.z = radius * Math.sin(quOverP) * 0.5;

        return result;
    }
}