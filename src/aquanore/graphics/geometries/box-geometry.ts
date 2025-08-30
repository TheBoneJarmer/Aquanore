import { Geometry } from "./geometry";

export class BoxGeometry extends Geometry {
    constructor(width: number = 1, height: number = 1, depth: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1) {
        super();

        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];

        widthSegments = Math.floor(widthSegments);
        heightSegments = Math.floor(heightSegments);
        depthSegments = Math.floor(depthSegments);

        // Generate planes
        const p1 = this.generatePlane(2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments, 0);
        const p2 = this.generatePlane(2, 1, 0, 1, -1, depth, height, -width, depthSegments, heightSegments, p1.totalVertices);
        const p3 = this.generatePlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments, p2.totalVertices);
        const p4 = this.generatePlane(0, 2, 1, 1, -1, width, depth, -height, widthSegments, depthSegments, p3.totalVertices);
        const p5 = this.generatePlane(0, 1, 2, 1, -1, width, height, depth, widthSegments, heightSegments, p4.totalVertices);
        const p6 = this.generatePlane(0, 1, 2, -1, -1, width, height, -depth, widthSegments, heightSegments, p5.totalVertices);

        // Update arrays
        for (let v of p1.vertices) vertices.push(v);
        for (let v of p2.vertices) vertices.push(v);
        for (let v of p3.vertices) vertices.push(v);
        for (let v of p4.vertices) vertices.push(v);
        for (let v of p5.vertices) vertices.push(v);
        for (let v of p6.vertices) vertices.push(v);

        for (let v of p1.normals) normals.push(v);
        for (let v of p2.normals) normals.push(v);
        for (let v of p3.normals) normals.push(v);
        for (let v of p4.normals) normals.push(v);
        for (let v of p5.normals) normals.push(v);
        for (let v of p6.normals) normals.push(v);

        for (let v of p1.uvs) uvs.push(v);
        for (let v of p2.uvs) uvs.push(v);
        for (let v of p3.uvs) uvs.push(v);
        for (let v of p4.uvs) uvs.push(v);
        for (let v of p5.uvs) uvs.push(v);
        for (let v of p6.uvs) uvs.push(v);

        for (let v of p1.indices) indices.push(v);
        for (let v of p2.indices) indices.push(v);
        for (let v of p3.indices) indices.push(v);
        for (let v of p4.indices) indices.push(v);
        for (let v of p5.indices) indices.push(v);
        for (let v of p6.indices) indices.push(v);

        this._vertices = vertices;
        this._normals = normals;
        this._uvs = uvs;
        this._indices = indices;

        this.updateArrays();
        this.generateBuffers();
    }

    private generatePlane(u: number, v: number, w: number, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number, totalVertices: number = 0) {
        const segmentWidth = width / gridX;
        const segmentHeight = height / gridY;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const depthHalf = depth / 2;
        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;

        let vertexCount: number = 0;
        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];
        let vector: number[] = [0, 0, 0];

        for (let iy = 0; iy < gridY1; iy++) {
            const y = iy * segmentHeight - heightHalf;

            for (let ix = 0; ix < gridX1; ix++) {
                const x = ix * segmentWidth - widthHalf;

                // Set values to correct vector component
                vector[u] = x * udir;
                vector[v] = y * vdir;
                vector[w] = depthHalf;

                // Now apply vector to vertex buffer
                vertices.push(vector[0], vector[1], vector[2]);

                // Set values to correct vector component
                vector[u] = 0;
                vector[v] = 0;
                vector[w] = depth > 0 ? 1 : - 1;

                // Now apply vector to normal buffer
                normals.push(vector[0], vector[1], vector[2]);

                // UVS
                uvs.push(ix / gridX);
                uvs.push(1 - (iy / gridY));

                // Counters
                vertexCount += 1;
            }
        }

        // Generate indices
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = totalVertices + ix + gridX1 * iy;
                const b = totalVertices + ix + gridX1 * (iy + 1);
                const c = totalVertices + (ix + 1) + gridX1 * (iy + 1);
                const d = totalVertices + (ix + 1) + gridX1 * iy;

                // Faces
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        return {
            vertices: vertices,
            normals: normals,
            uvs: uvs,
            indices: indices,
            totalVertices: totalVertices + vertexCount
        };
    }
}