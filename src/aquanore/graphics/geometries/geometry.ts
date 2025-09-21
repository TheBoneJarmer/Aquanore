import { Aquanore } from "../../aquanore";
import { IGeometry } from "../../interfaces/geometry";
import { Vector2, Vector3 } from "../../math";

export class Geometry implements IGeometry {
    private _vao: WebGLVertexArrayObject;
    private _indices: number[];
    private _vertices: number[];
    private _uvs: number[];
    private _normals: number[];
    private _tangents: number[];
    private _bitangents: number[];
    private _joints: number[];
    private _weights: number[];

    get vao(): WebGLVertexArrayObject {
        return this._vao;
    }

    set vao(value: WebGLVertexArrayObject) {
        this._vao = value;
    }

    get vertices(): number[] {
        return this._vertices;
    }

    set vertices(value: number[]) {
        this._vertices = value;
    }

    get normals(): number[] {
        return this._normals;
    }

    set normals(value: number[]) {
        this._normals = value;
    }

    get uvs(): number[] {
        return this._uvs;
    }

    set uvs(value: number[]) {
        this._uvs = value;
    }

    get indices(): number[] {
        return this._indices;
    }

    set indices(value: number[]) {
        this._indices = value;
    }

    get tangents(): number[] {
        return this._tangents;
    }

    set tangents(value: number[]) {
        this._tangents = value;
    }

    get bitangents(): number[] {
        return this._bitangents;
    }

    set bitangents(value: number[]) {
        this._bitangents = value;
    }

    get weights(): number[] {
        return this._weights;
    }

    set weights(value: number[]) {
        this._weights = value;
    }

    get joints(): number[] {
        return this._joints;
    }

    set joints(value: number[]) {
        this._joints = value;
    }

    /**
     * Calculates tangents and bitangents from the `vertices`, `uvs` and `indices` arrays and sets the `tangents` and `bitangents` arrays.
     */
    generateTangents() {
        const vertices = [];
        const uvs = [];
        const tangents = [];
        const bitangents = [];

        // First generate a list of all vertices and uvs
        for (let index of this._indices) {
            const v0 = this._vertices[index * 3 + 0];
            const v1 = this._vertices[index * 3 + 1];
            const v2 = this._vertices[index * 3 + 2];

            const uv0 = this._uvs[index * 2 + 0];
            const uv1 = this._uvs[index * 2 + 1];

            vertices.push(new Vector3(v0, v1, v2));
            uvs.push(new Vector2(uv0, uv1));
        }

        // Now calculate tangents and bitangents
        for (let i = 0; i < vertices.length; i += 3) {
            const v0 = vertices[i + 0];
            const v1 = vertices[i + 1];
            const v2 = vertices[i + 2];

            const uv0 = uvs[i + 0];
            const uv1 = uvs[i + 1];
            const uv2 = uvs[i + 2];

            const edge1 = Vector3.sub(v1, v0);
            const edge2 = Vector3.sub(v2, v0);
            const deltaUV1 = Vector2.sub(uv1, uv0);
            const deltaUV2 = Vector2.sub(uv2, uv0);

            const d = deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x;
            const f = d == 0 ? 0 : 1.0 / d;

            const t = new Vector3();
            t.x = (edge1.x * deltaUV2.y - edge2.x * deltaUV1.y) * f;
            t.y = (edge1.y * deltaUV2.y - edge2.y * deltaUV1.y) * f;
            t.z = (edge1.z * deltaUV2.y - edge2.z * deltaUV1.y) * f;

            const b = new Vector3();
            b.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
            b.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
            b.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);

            tangents.push(t);
            tangents.push(t);
            tangents.push(t);

            bitangents.push(b);
            bitangents.push(b);
            bitangents.push(b);
        }

        // And now add them to the buffer arrays by figuring out what index they belong to
        this._tangents = [];
        this._bitangents = [];

        for (let i = 0; i < this._indices.length; i++) {
            const index = this._indices[i];
            const tangent = tangents[i];
            const bitangent = bitangents[i];

            this._tangents[index * 3 + 0] = tangent.x;
            this._tangents[index * 3 + 1] = tangent.y;
            this._tangents[index * 3 + 2] = tangent.z;

            this._bitangents[index * 3 + 0] = bitangent.x;
            this._bitangents[index * 3 + 1] = bitangent.y;
            this._bitangents[index * 3 + 2] = bitangent.z;
        }
    }

    /**
     * Generates a vertex array object along with all the vertex buffer objects and an element buffer object for the indices.
     */
    generateBuffers() {
        const gl = Aquanore.ctx;
        const vao = gl.createVertexArray();
        const ebo = gl.createBuffer();
        const vboVertex = gl.createBuffer();
        const vboUV = gl.createBuffer();
        const vboNormal = gl.createBuffer();
        const vboTangent = gl.createBuffer();
        const vboBitangent = gl.createBuffer();
        const vboJoint = gl.createBuffer();
        const vboWeight = gl.createBuffer();

        if (this._vertices.length % 3 > 0) {
            throw new Error("Vertex array length not size of 3");
        }

        if (this._normals.length % 3 > 0) {
            throw new Error("Normal array length not size of 3");
        }

        if (this._uvs.length % 2 > 0) {
            throw new Error("UV array length not size of 2");
        }

        if (this._normals.length != this._vertices.length) {
            throw new Error("Normal array length mismatch");
        }

        if (this._uvs.length / 2 != this._vertices.length / 3) {
            throw new Error("UV array length mismatch");
        }

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboVertex);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboUV);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboTangent);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._tangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboBitangent);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bitangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(4);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboJoint);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._joints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(5);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboWeight);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._weights), gl.STATIC_DRAW);
        gl.vertexAttribPointer(6, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(6);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._vao = vao;
    }
}