import { Aquanore } from "./aquanore";
import { Color } from "./color";
import { Matrix3 } from "./matrix3";
import { Matrix4 } from "./matrix4";
import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";

export class Shader {
    private readonly _program: WebGLProgram;

    public get id(): WebGLProgram {
        return this._program;
    }

    public constructor(vSource: string, fSource: string) {
        const vShader = this.compileShader(vSource, Aquanore.ctx.VERTEX_SHADER);
        const fShader = this.compileShader(fSource, Aquanore.ctx.FRAGMENT_SHADER);

        this._program = this.compileProgram(vShader, fShader);
    }

    private compileProgram(vShader: WebGLShader, fShader: WebGLShader): WebGLProgram {
        const gl = Aquanore.ctx;

        const program = gl.createProgram()!;
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    private compileShader(source: string, type: GLenum): WebGLShader {
        const gl = Aquanore.ctx;
        const shader = gl.createShader(type)!;
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
    public u1i(name: string, i1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform1i(loc, i1);
    }

    public u2i(name: string, i1: number, i2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform2i(loc, i1, i2);
    }

    public u3i(name: string, i1: number, i2: number, i3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform3i(loc, i1, i2, i3);
    }

    public u4i(name: string, i1: number, i2: number, i3: number, i4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform4i(loc, i1, i2, i3, i4);
    }

    public u1f(name: string, f1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform1f(loc, f1);
    }

    public u2f(name: string, f1: number, f2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform2f(loc, f1, f2);
    }

    public u3f(name: string, f1: number, f2: number, f3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform3f(loc, f1, f2, f3);
    }

    public u4f(name: string, f1: number, f2: number, f3: number, f4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform4f(loc, f1, f2, f3, f4);
    }

    public u1b(name: string, b1: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform1i(loc, b1 ? 1 : 0);
    }

    public u2b(name: string, b1: boolean, b2: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform2i(loc, b1 ? 1 : 0, b2 ? 1 : 0);
    }

    public u3b(name: string, b1: boolean, b2: boolean, b3: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform3i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0);
    }

    public u4b(name: string, b1: boolean, b2: boolean, b3: boolean, b4: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform4i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0, b4 ? 1 : 0);
    }

    public uvec2(name: string, vec: Vector2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform2f(loc, vec.x, vec.y);
    }

    public uvec3(name: string, vec: Vector3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform3f(loc, vec.x, vec.y, vec.z);
    }

    public umat3(name: string, mat: Matrix3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniformMatrix3fv(loc, false, mat.values);
    }

    public umat4(name: string, mat: Matrix4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniformMatrix4fv(loc, false, mat.values);
    }

    public ucolor(name: string, color: Color) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._program, name);

        gl.uniform4f(loc, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
    }
}