import { Geometry } from "./geometry";

export class RawIndexGeometry extends Geometry {
    constructor(vertices: number[], normals: number[], uvs: number[], indices: number[]) {
        super();

        if (vertices == null) {
            throw new Error("Vertices cannot be null");
        }

        if (normals == null) {
            throw new Error("Normals cannot be null");
        }

        if (uvs == null) {
            throw new Error("UVs cannot be null");
        }

        if (vertices.length % 3 == 1) {
            throw new Error("Incorrect vertex count");
        }

        if (normals.length % 3 == 1) {
            throw new Error("Incorrect normal count");
        }

        if (uvs.length % 2 == 1) {
            throw new Error("Incorrect uv count");
        }

        if (normals.length != vertices.length) {
            throw new Error("Normal array length mismatch.");
        }

        if (vertices.length / 3 != uvs.length / 2) {
            throw new Error("UV array length mismatch.");
        }

        this._vertices = vertices;
        this._normals = normals;
        this._uvs = uvs;
        this._indices = indices;

        this.updateArrays();
        this.generateBuffers();
    }
}