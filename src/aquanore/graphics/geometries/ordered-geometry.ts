import { Aquanore } from "../../aquanore";
import { IGeometry } from "../../interfaces";

/**
 * The BaseGeometry class represents geometry where all vertices, normals and uvs are in order and share the same index.
 * In most modern applications index-based vectors are used because they reduce the size significantly.
 * Which is why you likely will not need to use this class. 
 * That said, in case you do encounter a situation where you do not have indices you can use this class instead.
 * Aquanore uses the IndexGeometry for everything else though.
 */
export abstract class OrderedGeometry implements IGeometry {
    protected _vertices: number[];
    protected _uvs: number[];
    protected _normals: number[];
    protected _tangents: number[];
    protected _bitangents: number[];

    private _vboVertices: WebGLBuffer;
    private _vboTexcoords: WebGLBuffer;
    private _vboNormals: WebGLBuffer;
    private _vboTangents: WebGLBuffer;
    private _vboBitangents: WebGLBuffer;
    private _vao: WebGLVertexArrayObject;

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
        this._vboVertices = gl.createBuffer();
        this._vboTexcoords = gl.createBuffer();
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

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboTexcoords);
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

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}