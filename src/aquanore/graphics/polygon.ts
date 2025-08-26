import { Aquanore } from "../aquanore";

export class Polygon {
    private readonly _vertices: number[];
    private readonly _texcoords: number[];

    private _vboVertices: WebGLBuffer = null;
    private _vboTexcoords: WebGLBuffer = null;
    private _vao: WebGLVertexArrayObject = null;

    public get vao() {
        return this._vao;
    }

    public get vertices(): number[] {
        return this._vertices;
    }

    public get texcoords(): number[] {
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
        const gl = Aquanore.ctx!;

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

    /* CONSTRUCTION FUNCTIONS */
    public static square(size: number) {
        const vertices = [0, 0, size, 0, 0, size, size, 0, 0, size, size, size];
        const texcoords = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, texcoords);
    }

    public static rectangle(width: number, height: number) {
        const vertices = [0, 0, width, 0, 0, height, width, 0, 0, height, width, height];
        const texcoords = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, texcoords);
    }
}