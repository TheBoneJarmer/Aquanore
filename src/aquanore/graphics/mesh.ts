import { Aquanore } from "../aquanore";
import { Vector3 } from "../math";
import { Material, BasicMaterial } from "./materials";

export class Mesh {
    private _vertices: number[];
    private _texcoords: number[];
    private _normals: number[];
    private _indices: number[];

    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;
    private _material: Material;

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

    public get material(): Material {
        return this._material;
    }

    public set material(value: Material) {
        if (value == null) {
            throw new Error("Material cannot be null");
        }

        this._material = value;
    }

    public constructor(vertices: number[], texcoords: number[], normals: number[], indices: number[]) {
        if (vertices == null) {
            throw new Error("Vertices cannot be null");
        }

        if (normals == null) {
            throw new Error("Normals cannot be null");
        }

        if (texcoords == null) {
            throw new Error("Texcoords cannot be null");
        }

        if (vertices.length % 3 == 1) {
            throw new Error("Incorrect vertex count");
        }

        if (normals.length % 3 == 1) {
            throw new Error("Incorrect normal count");
        }

        if (texcoords.length % 2 == 1) {
            throw new Error("Incorrect texcoord count");
        }

        if (normals.length != vertices.length) {
            throw new Error("Normal array length mismatch.");
        }

        if (vertices.length / 3 != texcoords.length / 2) {
            throw new Error("Texcoord array length mismatch.");
        }

        this._vertices = vertices;
        this._texcoords = texcoords;
        this._normals = normals;
        this._indices = indices;
        this._material = new BasicMaterial();

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

    // public calculateNormals() {
    //     const gl = Aquanore.ctx;
    //     const vertices = [];
    //     const normals = [];

    //     this._normals = [];

    //     for (let i = 0; i < this._vertices.length; i += 3) {
    //         const v = new Vector3();
    //         v.x = this._vertices[i];
    //         v.y = this._vertices[i + 1];
    //         v.z = this._vertices[i + 2];

    //         vertices.push(v);
    //     }

    //     for (let i = 0; i < vertices.length; i += 3) {
    //         const v1 = vertices[i];
    //         const v2 = vertices[i + 1];
    //         const v3 = vertices[i + 2];

    //         const a = Vector3.sub(v2, v1);
    //         const b = Vector3.sub(v3, v1);
    //         const n = Vector3.normalized(Vector3.cross(a, b));

    //         normals.push(n);
    //         normals.push(n);
    //         normals.push(n);
    //     }

    //     for (let v of normals) {
    //         this._normals.push(v.x);
    //         this._normals.push(v.y);
    //         this._normals.push(v.z);
    //     }

    //     gl.bindVertexArray(this._vao);
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this._vboNormals);
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);
    //     gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(1);
    //     gl.bindVertexArray(null);
    //     gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // }
}