import { Aquanore } from "../aquanore";

export class Polygon {
    private _vertices: number[];
    private _uvs: number[];
    private _vao: WebGLVertexArrayObject;

    get vao(): WebGLVertexArrayObject {
        return this._vao;
    }

    get vertices(): number[] {
        return this._vertices;
    }

    get uvs(): number[] {
        return this._uvs;
    }

    constructor(vertices: number[], uvs: number[]) {
        if (vertices == null) {
            throw new Error("Vertices cannot be null");
        }

        if (uvs == null) {
            throw new Error("UVs cannot be null");
        }

        if (vertices.length < 3) {
            throw new Error("Polygon requires a minimum of 3 vertices");
        }

        if (vertices.length != uvs.length) {
            throw new Error("UVs and vertices must have the same length");
        }

        this._vertices = vertices;
        this._uvs = uvs;

        this.generateBuffers();
    }

    private generateBuffers() {
        const gl = Aquanore.ctx;

        const vao = gl.createVertexArray();
        const vboVertices = gl.createBuffer();
        const vboUVs = gl.createBuffer();

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboUVs);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        this._vao = vao;
    }

    /* FACTORY FUNCTIONS */
    static square(size: number): Polygon {
        const vertices = [0, 0, size, 0, 0, size, size, 0, 0, size, size, size];
        const uvs = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, uvs);
    }

    static rectangle(width: number, height: number): Polygon {
        const vertices = [0, 0, width, 0, 0, height, width, 0, 0, height, width, height];
        const uvs = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, uvs);
    }
}