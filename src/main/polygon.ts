import {Jarmer} from "./jarmer";

export class Polygon {
    private readonly _vertices: number[];
    private readonly _texcoords: number[];

    private _vboVertices: WebGLBuffer;
    private _vboTexcoords: WebGLBuffer;
    private _vao: WebGLVertexArrayObject;

    public get vao() {
        return this._vao;
    }

    get vertices(): number[] {
        return this._vertices;
    }

    get texcoords(): number[] {
        return this._texcoords;
    }

    public constructor(vertices: number[], texcoords: number[]) {
        if (vertices == null) {
            throw new Error("Vertices cannot be null");
        }

        if (texcoords == null) {
            throw new Error("Texcoords cannot be null");
        }

        if (vertices.length < 3) {
            throw new Error("Polygon requires a minimum of 3 vertices");
        }

        if (vertices.length != texcoords.length) {
            throw new Error("Texcoords and vertices must have the same length");
        }

        this._vertices = vertices;
        this._texcoords = texcoords;

        this.generateBuffers();
    }

    private generateBuffers() {
        const gl = Jarmer.ctx;

        this._vao = gl.createVertexArray();
        this._vboVertices = gl.createBuffer();
        this._vboTexcoords = gl.createBuffer();

        gl.bindVertexArray(this._vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboTexcoords);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texcoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
}