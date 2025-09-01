import { Aquanore } from "../aquanore";

export class Polygon {
    #vertices = [];
    #uvs = [];
    #vboVertices = null;
    #vboUVs = null;
    #vao = null;

    get vao() {
        return this.#vao;
    }

    get vertices() {
        return this.#vertices;
    }

    get uvs() {
        return this.#uvs;
    }

    constructor(vertices, uvs) {
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

        this.#vertices = vertices;
        this.#uvs = uvs;

        this.#generateBuffers();
    }

    #generateBuffers() {
        const gl = Aquanore.ctx;

        this.#vao = gl.createVertexArray();
        this.#vboVertices = gl.createBuffer();
        this.#vboUVs = gl.createBuffer();

        gl.bindVertexArray(this.#vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vboUVs);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    /* FACTORY FUNCTIONS */
    static square(size) {
        const vertices = [0, 0, size, 0, 0, size, size, 0, 0, size, size, size];
        const uvs = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, uvs);
    }

    static rectangle(width, height) {
        const vertices = [0, 0, width, 0, 0, height, width, 0, 0, height, width, height];
        const uvs = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        return new Polygon(vertices, uvs);
    }
}