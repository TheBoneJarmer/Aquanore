import { Aquanore } from "./aquanore";
import { Vector3 } from "./vector3";

export class Mesh {
    private readonly _vertices: number[];
    private readonly _texcoords: number[];
    private readonly _normals: number[];
    private readonly _indices: number[];
    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;

    private _vboVertices: WebGLBuffer = null;
    private _vboTexcoords: WebGLBuffer = null;
    private _vboNormals: WebGLBuffer = null;
    private _vao: WebGLVertexArrayObject = null;
    private _ebo: WebGLBuffer = null;

    public get vao() {
        return this._vao;
    }

    public get ebo() {
        return this._ebo;
    }

    public get vertices(): number[] {
        return this._vertices;
    }

    public get texcoords(): number[] {
        return this._texcoords;
    }

    public get normals(): number[] {
        return this._normals;
    }

    public get indices(): number[] {
        return this._indices;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public set rotation(value: Vector3) {
        this._rotation = value;
    }

    public get scale(): Vector3 {
        return this._scale;
    }

    public set scale(value: Vector3) {
        this._scale = value;
    }

    public constructor(vertices: number[], texcoords: number[], normals: number[], indices: number[]) {
        if (vertices == null) {
            throw new Error("Vertices cannot be null");
        }

        if (vertices == null) {
            throw new Error("Normals cannot be null");
        }

        if (texcoords == null) {
            throw new Error("Texcoords cannot be null");
        }

        // if (vertices.length % 3 == 1) {
        //     throw new Error("Incorrect vertices count");
        // }

        this._vertices = vertices;
        this._texcoords = texcoords;
        this._normals = normals;
        this._indices = indices;

        this.generateBuffers();
    }

    private generateBuffers() {
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texcoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}