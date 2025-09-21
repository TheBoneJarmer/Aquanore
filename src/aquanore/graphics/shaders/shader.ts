import { Aquanore } from "../../aquanore";
import { Matrix3, Matrix4, Vector3, Vector2 } from "../../math";
import { Color } from "../color";

export class Shader {
    private _id: WebGLProgram;

    get id(): WebGLProgram {
        return this._id;
    }

    constructor(vSource: string, fSource: string) {
        const vShader = this.compileShader(vSource, Aquanore.ctx.VERTEX_SHADER);
        const fShader = this.compileShader(fSource, Aquanore.ctx.FRAGMENT_SHADER);

        this._id = this.compileProgram(vShader, fShader);
    }

    private compileProgram(vShader: WebGLShader, fShader: WebGLShader): WebGLProgram {
        const gl = Aquanore.ctx;

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    private compileShader(source: string, type: number) {
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
    u1i(name: string, i1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform1i(loc, i1);
    }

    u2i(name: string, i1: number, i2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform2i(loc, i1, i2);
    }

    u3i(name: string, i1: number, i2: number, i3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform3i(loc, i1, i2, i3);
    }

    u4i(name: string, i1: number, i2: number, i3: number, i4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform4i(loc, i1, i2, i3, i4);
    }

    u1f(name: string, f1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform1f(loc, f1);
    }

    u2f(name: string, f1: number, f2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform2f(loc, f1, f2);
    }

    u3f(name: string, f1: number, f2: number, f3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform3f(loc, f1, f2, f3);
    }

    u4f(name: string, f1: number, f2: number, f3: number, f4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform4f(loc, f1, f2, f3, f4);
    }

    u1b(name: string, b1: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform1i(loc, b1 ? 1 : 0);
    }

    u2b(name: string, b1: boolean, b2: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform2i(loc, b1 ? 1 : 0, b2 ? 1 : 0);
    }

    u3b(name: string, b1: boolean, b2: boolean, b3: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform3i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0);
    }

    u4b(name: string, b1: boolean, b2: boolean, b3: boolean, b4: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform4i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0, b4 ? 1 : 0);
    }

    uvec2(name: string, vec: Vector2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform2f(loc, vec.x, vec.y);
    }

    uvec3(name: string, vec: Vector3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform3f(loc, vec.x, vec.y, vec.z);
    }

    umat3(name: string, mat: Matrix3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniformMatrix3fv(loc, false, mat.values);
    }

    umat4(name: string, mat: Matrix4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniformMatrix4fv(loc, false, mat.values);
    }

    ucolor(name: string, color: Color) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        gl.uniform4f(loc, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
    }
}