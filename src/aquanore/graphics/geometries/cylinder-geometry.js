import { Vector2, Vector3 } from "../../math";
import { Geometry } from "./geometry";

export class CylinderGeometry extends Geometry {
    constructor(radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
        super();

        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];
        let index = 0;

        radialSegments = Math.floor(radialSegments);
        heightSegments = Math.floor(heightSegments);

        const torso = this.#generateCylinderTorso(radiusTop, radiusBottom, height, radialSegments, heightSegments);
        index = torso.index;

        for (let v of torso.vertices) vertices.push(v);
        for (let n of torso.normals) normals.push(n);
        for (let uv of torso.uvs) uvs.push(uv);
        for (let i of torso.indices) indices.push(i);

        if (!openEnded) {
            if (radiusTop > 0) {
                const cap = this.#generateCylinderCap(true, index, height, radiusTop, radiusBottom, radialSegments);
                index = cap.index;

                for (let v of cap.vertices) vertices.push(v);
                for (let n of cap.normals) normals.push(n);
                for (let uv of cap.uvs) uvs.push(uv);
                for (let i of cap.indices) indices.push(i);
            }

            if (radiusBottom > 0) {
                const cap = this.#generateCylinderCap(false, index, height, radiusTop, radiusBottom, radialSegments);
                index = cap.index;

                for (let v of cap.vertices) vertices.push(v);
                for (let n of cap.normals) normals.push(n);
                for (let uv of cap.uvs) uvs.push(uv);
                for (let i of cap.indices) indices.push(i);
            }
        }

        this.vertices = vertices;
        this.normals = normals;
        this.uvs = uvs;
        this.indices = indices;

        this.updateArrays();
        this.generateBuffers();
    }

    #generateCylinderTorso(radiusTop, radiusBottom, height, radialSegments, heightSegments) {
        const thetaStart = 0;
        const thetaLength = Math.PI * 2;
        const indexArray = [];
        const halfHeight = height / 2;

        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];
        let index = 0;

        let normal = new Vector3();
        let vertex = new Vector3();

        // this will be used to calculate the normal
        const slope = (radiusBottom - radiusTop) / height;

        // Generate vertices, normals and UVs
        for (let y = 0; y <= heightSegments; y++) {
            const indexRow = [];
            const v = y / heightSegments;

            // Calculate the radius of the current row
            const radius = v * (radiusBottom - radiusTop) + radiusTop;

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * thetaLength + thetaStart;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // Vertex
                vertex.x = radius * sinTheta;
                vertex.y = - v * height + halfHeight;
                vertex.z = radius * cosTheta;
                vertices.push(vertex.x, vertex.y, vertex.z);

                // Normal
                normal.x = sinTheta;
                normal.y = slope;
                normal.z = cosTheta;
                normal = Vector3.normalized(normal);

                normals.push(normal.x, normal.y, normal.z);

                // UV
                uvs.push(u, 1 - v);

                // Save index of vertex in respective row
                indexRow.push(index++);
            }

            // Now save vertices of the row in our index array
            indexArray.push(indexRow);
        }

        // Generate indices
        for (let x = 0; x < radialSegments; x++) {

            for (let y = 0; y < heightSegments; y++) {

                // We use the index array to access the correct indices
                const a = indexArray[y][x];
                const b = indexArray[y + 1][x];
                const c = indexArray[y + 1][x + 1];
                const d = indexArray[y][x + 1];

                // faces
                if (radiusTop > 0 || y !== 0) {
                    indices.push(a, b, d);
                }

                if (radiusBottom > 0 || y !== heightSegments - 1) {
                    indices.push(b, c, d);
                }
            }
        }

        return {
            vertices: vertices,
            normals: normals,
            uvs: uvs,
            indices: indices,

            index: index
        };
    }

    #generateCylinderCap(top, index, height, radiusTop, radiusBottom, radialSegments) {
        const thetaStart = 0;
        const thetaLength = Math.PI * 2;
        const halfHeight = height / 2;
        const centerIndexStart = index;
        const uv = new Vector2();
        const vertex = new Vector3();

        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];

        const radius = (top === true) ? radiusTop : radiusBottom;
        const sign = (top === true) ? 1 : - 1;

        for (let x = 1; x <= radialSegments; x++) {
            vertices.push(0, halfHeight * sign, 0);
            normals.push(0, sign, 0);
            uvs.push(0.5, 0.5);

            index++;
        }

        // Save the index of the last center vertex
        const centerIndexEnd = index;

        // Now we generate the surrounding vertices, normals and uvs
        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * thetaLength + thetaStart;

            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            // Vertex
            vertex.x = radius * sinTheta;
            vertex.y = halfHeight * sign;
            vertex.z = radius * cosTheta;
            vertices.push(vertex.x, vertex.y, vertex.z);

            // Normal
            normals.push(0, sign, 0);

            // UV
            uv.x = (cosTheta * 0.5) + 0.5;
            uv.y = (sinTheta * 0.5 * sign) + 0.5;
            uvs.push(uv.x, uv.y);

            // Increase index
            index++;
        }

        // Generate indices
        for (let x = 0; x < radialSegments; x++) {
            const c = centerIndexStart + x;
            const i = centerIndexEnd + x;

            if (top === true) {
                indices.push(i, i + 1, c);
            } else {
                indices.push(i + 1, i, c);
            }
        }

        return {
            vertices: vertices,
            normals: normals,
            uvs: uvs,
            indices: indices,

            index: index
        };
    }
}