import { Vector3 } from "../../math";
import { Geometry } from "./geometry";

export class CapsuleGeometry extends Geometry {
    constructor(radius = 1, height = 1, capSegments = 16, radialSegments = 32, heightSegments = 1) {
        super();
        
        let vertices = [];
        let normals = [];
        let uvs = [];
        let indices = [];

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

        this.vertices = vertices;
        this.normals = normals;
        this.uvs = uvs;
        this.indices = indices;

        this.updateArrays();
        this.generateBuffers();
    }
}