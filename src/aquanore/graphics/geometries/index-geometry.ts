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

    private _vboVertices: WebGLBuffer;
    private _vboTexcoords: WebGLBuffer;
    private _vboNormals: WebGLBuffer;
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

    protected generateBuffers() {
        const gl = Aquanore.ctx;

        this._vao = gl.createVertexArray();
        this._ebo = gl.createBuffer();
        this._vboVertices = gl.createBuffer();
        this._vboTexcoords = gl.createBuffer();
        this._vboNormals = gl.createBuffer();

        gl.bindVertexArray(this._vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboNormals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboTexcoords);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}