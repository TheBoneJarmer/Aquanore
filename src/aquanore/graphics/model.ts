import { Vector2, Vector3 } from "../math";
import { Mesh } from "./mesh";

export class Model {
    public meshes: Mesh[] = [];

    /* CONSTRUCTION FUNCTIONS */
    public static cube(size: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1): Model {
        return this.box(size, size, size, widthSegments, heightSegments, depthSegments);
    }

    public static box(width: number = 1, height: number = 1, depth: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1): Model {
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

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static sphere(radius: number = 1, widthSegments: number = 32, heightSegments: number = 16): Model {
        let index = 0;
        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];
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

        const mesh = new Mesh(vertices, uvs, normals, indices);

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static capsule(radius: number = 1, height: number = 1, capSegments: number = 16, radialSegments: number = 32, heightSegments: number = 1): Model {
        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];

        height = Math.max(0, height);
        capSegments = Math.max(1, Math.floor(capSegments));
        radialSegments = Math.max(3, Math.floor(radialSegments));
        heightSegments = Math.max(1, Math.floor(heightSegments));

        // Helper variables
        const halfHeight = height / 2;
        const capArcLength = (Math.PI / 2) * radius;
        const cylinderPartLength = height;
        const totalArcLength = 2 * capArcLength + cylinderPartLength;
        const numVerticalSegments = capSegments * 2 + heightSegments;
        const verticesPerRow = radialSegments + 1;

        let normal = new Vector3();
        let vertex = new Vector3();

        // Generate vertices, normals and uvs
        for (let iy = 0; iy <= numVerticalSegments; iy++) {
            let currentArcLength = 0;
            let profileY = 0;
            let profileRadius = 0;
            let normalYComponent = 0;

            if (iy <= capSegments) {

                // Bottom cap
                const segmentProgress = iy / capSegments;
                const angle = (segmentProgress * Math.PI) / 2;

                profileY = - halfHeight - radius * Math.cos(angle);
                profileRadius = radius * Math.sin(angle);
                normalYComponent = - radius * Math.cos(angle);
                currentArcLength = segmentProgress * capArcLength;

            } else if (iy <= capSegments + heightSegments) {

                // Middle section
                const segmentProgress = (iy - capSegments) / heightSegments;

                profileY = - halfHeight + segmentProgress * height;
                profileRadius = radius;
                normalYComponent = 0;
                currentArcLength = capArcLength + segmentProgress * cylinderPartLength;

            } else {

                // Top cap
                const segmentProgress = (iy - capSegments - heightSegments) / capSegments;
                const angle = (segmentProgress * Math.PI) / 2;

                profileY = halfHeight + radius * Math.sin(angle);
                profileRadius = radius * Math.cos(angle);
                normalYComponent = radius * Math.sin(angle);
                currentArcLength = capArcLength + cylinderPartLength + segmentProgress * capArcLength;

            }

            const v = Math.max(0, Math.min(1, currentArcLength / totalArcLength));

            // Special case for the poles
            let uOffset = 0;

            if (iy === 0) {
                uOffset = 0.5 / radialSegments;
            } else if (iy === numVerticalSegments) {
                uOffset = - 0.5 / radialSegments;
            }

            for (let ix = 0; ix <= radialSegments; ix++) {
                const u = ix / radialSegments;
                const theta = u * Math.PI * 2;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // Vertex
                vertex.x = - profileRadius * cosTheta;
                vertex.y = profileY;
                vertex.z = profileRadius * sinTheta;
                vertices.push(vertex.x, vertex.y, vertex.z);

                // Normal
                normal.x = -profileRadius * cosTheta;
                normal.y = normalYComponent;
                normal.z = profileRadius * sinTheta;
                normal = Vector3.normalized(normal);

                normals.push(normal.x, normal.y, normal.z);

                // UV
                uvs.push(u + uOffset, v);
            }

            // Generate indices
            if (iy > 0) {
                const prevIndexRow = (iy - 1) * verticesPerRow;

                for (let ix = 0; ix < radialSegments; ix++) {
                    const i1 = prevIndexRow + ix;
                    const i2 = prevIndexRow + ix + 1;
                    const i3 = iy * verticesPerRow + ix;
                    const i4 = iy * verticesPerRow + ix + 1;

                    indices.push(i1, i2, i3);
                    indices.push(i2, i4, i3);
                }
            }
        }

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static cylinder(radiusTop: number = 1, radiusBottom: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1, openEnded: boolean = false): Model {
        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];
        let index = 0;

        radialSegments = Math.floor(radialSegments);
        heightSegments = Math.floor(heightSegments);

        const torso = this.generateCylinderTorso(radiusTop, radiusBottom, height, radialSegments, heightSegments);
        index = torso.index;

        for (let v of torso.vertices) vertices.push(v);
        for (let n of torso.normals) normals.push(n);
        for (let uv of torso.uvs) uvs.push(uv);
        for (let i of torso.indices) indices.push(i);

        if (!openEnded) {
            if (radiusTop > 0) {
                const cap = this.generateCylinderCap(true, index, height, radiusTop, radiusBottom, radialSegments);
                index = cap.index;

                for (let v of cap.vertices) vertices.push(v);
                for (let n of cap.normals) normals.push(n);
                for (let uv of cap.uvs) uvs.push(uv);
                for (let i of cap.indices) indices.push(i);
            }

            if (radiusBottom > 0) {
                const cap = this.generateCylinderCap(false, index, height, radiusTop, radiusBottom, radialSegments);
                index = cap.index;

                for (let v of cap.vertices) vertices.push(v);
                for (let n of cap.normals) normals.push(n);
                for (let uv of cap.uvs) uvs.push(uv);
                for (let i of cap.indices) indices.push(i);
            }
        }

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static cone(radius: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1, openEnded = false): Model {
        return this.cylinder(0, radius, height, radialSegments, heightSegments, opener);
    }

    public static torus(radius: number = 1, tube: number = 0.4, radialSegments: number = 12, tubularSegments: number = 48) {
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

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static torusKnot(radius: number = 1, tube: number = 0.4, tubularSegments: number = 64, radialSegments: number = 8, p: number = 2, q: number = 3): Model {
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

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    public static ring(innerRadius: number = 0.5, outerRadius: number = 1, thetaSegments: number = 32, phiSegments: number = 1): Model {
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

        // Generate model and meshes
        const mesh = new Mesh(vertices, uvs, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    /* HELPER FUNCTIONS */
    private static generatePlane(u: number, v: number, w: number, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number, totalVertices: number = 0) {
        const segmentWidth = width / gridX;
        const segmentHeight = height / gridY;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const depthHalf = depth / 2;
        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;

        let vertexCount = 0;
        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];
        let vector = [0, 0, 0];

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

    private static generateCylinderTorso(radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number) {
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

    private static generateCylinderCap(top: boolean, index: number, height: number, radiusTop: number, radiusBottom: number, radialSegments: number) {
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

    private static calculatePositionOnCurve(u: number, p: number, q: number, radius: number): Vector3 {
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