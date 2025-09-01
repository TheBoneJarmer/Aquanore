import { Aquanore } from "../../aquanore";
import { Matrix3, Matrix4, Vector3, Vector2 } from "../../math";
import { Color } from "../color";

export class Shader {
    #program = null;

    get id() {
        return this.#program;
    }

    constructor(vSource, fSource) {
        const vShader = this.#compileShader(vSource, Aquanore.ctx.VERTEX_SHADER);
        const fShader = this.#compileShader(fSource, Aquanore.ctx.FRAGMENT_SHADER);

        this.#program = this.#compileProgram(vShader, fShader);
    }

    #compileProgram(vShader, fShader) {
        const gl = Aquanore.ctx;

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    #compileShader(source, type) {
        const gl = Aquanore.ctx;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (!status) {
            if (type == Aquanore.ctx.VERTEX_SHADER) {
                throw new Error("Vertex shader compilation failed: " + gl.getShaderInfoLog(shader));
            }

            if (type == Aquanore.ctx.FRAGMENT_SHADER) {
                throw new Error("Fragment shader compilation failed: " + gl.getShaderInfoLog(shader));
            }
        }

        return shader;
    }

    /* UNIFORM FUNCTIONS */
    u1i(name, i1) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform1i(loc, i1);
    }

    u2i(name, i1, i2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform2i(loc, i1, i2);
    }

    u3i(name, i1, i2, i3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform3i(loc, i1, i2, i3);
    }

    u4i(name, i1, i2, i3, i4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform4i(loc, i1, i2, i3, i4);
    }

    u1f(name, f1) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform1f(loc, f1);
    }

    u2f(name, f1, f2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform2f(loc, f1, f2);
    }

    u3f(name, f1, f2, f3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform3f(loc, f1, f2, f3);
    }

    u4f(name, f1, f2, f3, f4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform4f(loc, f1, f2, f3, f4);
    }

    u1b(name, b1) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform1i(loc, b1 ? 1 : 0);
    }

    u2b(name, b1, b2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform2i(loc, b1 ? 1 : 0, b2 ? 1 : 0);
    }

    u3b(name, b1, b2, b3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform3i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0);
    }

    u4b(name, b1, b2, b3, b4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform4i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0, b4 ? 1 : 0);
    }

    uvec2(name, vec) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform2f(loc, vec.x, vec.y);
    }

    uvec3(name, vec) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform3f(loc, vec.x, vec.y, vec.z);
    }

    umat3(name, mat) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniformMatrix3fv(loc, false, mat.values);
    }

    umat4(name, mat) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniformMatrix4fv(loc, false, mat.values);
    }

    ucolor(name, color) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this.#program, name);

        gl.uniform4f(loc, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
    }
}