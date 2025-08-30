import { Aquanore } from "../../aquanore";
import { IGeometry } from "../../interfaces";
import { Vector2, Vector3 } from "../../math";

export abstract class Geometry implements IGeometry {
    protected _vertices: number[];
    protected _uvs: number[];
    protected _normals: number[];
    protected _indices: number[];
    protected _tangents: number[];
    protected _bitangents: number[];

    private _vboVertices: WebGLBuffer;
    private _vboUvs: WebGLBuffer;
    private _vboNormals: WebGLBuffer;
    private _vboTangents: WebGLBuffer;
    private _vboBitangents: WebGLBuffer;
    private _vao: WebGLVertexArrayObject;
    private _ebo: WebGLBuffer;

    get vao(): WebGLVertexArrayObject {
        return this._vao;
    }

    get vertices(): number[] {
        return this._vertices;
    }

    get normals(): number[] {
        return this._normals;
    }

    get uvs(): number[] {
        return this._uvs;
    }

    get indices(): number[] {
        return this._indices;
    }

    get tangents(): number[] {
        return this._tangents;
    }

    get bitangents(): number[] {
        return this._bitangents;
    }

    protected updateArrays() {
        const vertices: Vector3[] = [];
        const uvs: Vector2[] = [];
        const tangents: Vector3[] = [];
        const bitangents: Vector3[] = [];

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

    protected generateBuffers() {
        const gl = Aquanore.ctx;

        this._vao = gl.createVertexArray();
        this._ebo = gl.createBuffer();
        this._vboVertices = gl.createBuffer();
        this._vboUvs = gl.createBuffer();
        this._vboNormals = gl.createBuffer();
        this._vboTangents = gl.createBuffer();
        this._vboBitangents = gl.createBuffer();

        gl.bindVertexArray(this._vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboNormals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboUvs);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboTangents);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._tangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(3);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboBitangents);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bitangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(4);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}