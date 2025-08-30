import { Aquanore } from "../../aquanore";
import { IGeometry } from "../../interfaces";

/**
 * The IndexGeometry class represents geometry where all vertices, normals and uvs are index-based. 
 * This means that instead of having all of the vectors in order the order is based on their index as defined in the `indices` array.
 * The Vertex Array Object therefore uses an Element Buffer Object to store those indices.
 */
export abstract class IndexGeometry implements IGeometry {
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

    protected generateTangents() {
        
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