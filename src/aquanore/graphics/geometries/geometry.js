import { Aquanore } from "../../aquanore";
import { Vector2, Vector3 } from "../../math";

export class Geometry {
    #vao = null;
    #indices = [];
    #vertices = [];
    #uvs = [];
    #normals = [];
    #tangents = [];
    #bitangents = [];
    #joints = [];
    #weights = [];

    get vao() {
        return this.#vao;
    }

    set vao(value) {
        this.#vao = value;
    }

    get vertices() {
        return this.#vertices;
    }

    set vertices(value) {
        this.#vertices = value;
    }

    get normals() {
        return this.#normals;
    }

    set normals(value) {
        this.#normals = value;
    }

    get uvs() {
        return this.#uvs;
    }

    set uvs(value) {
        this.#uvs = value;
    }

    get indices() {
        return this.#indices;
    }

    set indices(value) {
        this.#indices = value;
    }

    get tangents() {
        return this.#tangents;
    }

    set tangents(value) {
        this.#tangents = value;
    }

    get bitangents() {
        return this.#bitangents;
    }

    set bitangents(value) {
        this.#bitangents = value;
    }

    get weights() {
        return this.#weights;
    }

    set weights(value) {
        this.#weights = value;
    }

    get joints() {
        return this.#joints;
    }

    set joints(value) {
        this.#joints = value;
    }

    generateTangents() {
        const vertices = [];
        const uvs = [];
        const tangents = [];
        const bitangents = [];

        // First generate a list of all vertices and uvs
        for (let index of this.#indices) {
            const v0 = this.#vertices[index * 3 + 0];
            const v1 = this.#vertices[index * 3 + 1];
            const v2 = this.#vertices[index * 3 + 2];

            const uv0 = this.#uvs[index * 2 + 0];
            const uv1 = this.#uvs[index * 2 + 1];

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
        this.#tangents = [];
        this.#bitangents = [];

        for (let i = 0; i < this.#indices.length; i++) {
            const index = this.#indices[i];
            const tangent = tangents[i];
            const bitangent = bitangents[i];

            this.#tangents[index * 3 + 0] = tangent.x;
            this.#tangents[index * 3 + 1] = tangent.y;
            this.#tangents[index * 3 + 2] = tangent.z;

            this.#bitangents[index * 3 + 0] = bitangent.x;
            this.#bitangents[index * 3 + 1] = bitangent.y;
            this.#bitangents[index * 3 + 2] = bitangent.z;
        }
    }

    generateBuffers() {
        const gl = Aquanore.ctx;
        const vao = gl.createVertexArray();
        const ebo = gl.createBuffer();
        const vboVertex = gl.createBuffer();
        const vboUV = gl.createBuffer();
        const vboNormal = gl.createBuffer();
        const vboTangent = gl.createBuffer();
        const vboBitangent = gl.createBuffer();
        const vboJoint = gl.createBuffer();
        const vboWeight = gl.createBuffer();

        if (this.#vertices.length % 3 > 0) {
            throw new Error("Vertex array length not size of 3");
        }

        if (this.#normals.length % 3 > 0) {
            throw new Error("Normal array length not size of 3");
        }

        if (this.#uvs.length % 2 > 0) {
            throw new Error("UV array length not size of 2");
        }

        if (this.#normals.length != this.#vertices.length) {
            throw new Error("Normal array length mismatch");
        }

        if (this.#uvs.length / 2 != this.#vertices.length / 3) {
            throw new Error("UV array length mismatch");
        }

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboVertex);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboUV);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboTangent);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#tangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboBitangent);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#bitangents), gl.STATIC_DRAW);
        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(4);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboJoint);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#joints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(5);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboWeight);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#weights), gl.STATIC_DRAW);
        gl.vertexAttribPointer(6, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(6);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.#indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.#vao = vao;
    }
}