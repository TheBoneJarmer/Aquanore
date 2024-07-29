import {Aquanore} from "./aquanore";

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

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    private compileShader(source: string, type: GLenum): WebGLShader {
        const gl = Aquanore.ctx;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (!status) {
            throw new Error("WebGL shader compilation failed: " + gl.getShaderInfoLog(shader));
        }

        return shader;
    }
}