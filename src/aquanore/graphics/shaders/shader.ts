import { Aquanore } from "../../aquanore";
import { Matrix3, Matrix4, Vector3, Vector2 } from "../../math";
import { Color } from "../color";

export class Shader {
    private _id: WebGLProgram;

    /**
     * Returns the WebGL shader program object
     * @returns {WebGLProgram}
     */
    get id(): WebGLProgram {
        return this._id;
    }

    /**
     * Constructs a shader object from a vertex shader source string and a fragment shader source string. 
     * Don't forget to add the \\n characters at the end of each line or else the damn thing wont compile.
     * @param {string} vSource The vertex shader source
     * @param {string} fSource The fragment shader source
     */
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

    private compileShader(source: string, type: number): WebGLShader {
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
    /**
     * Sets an int uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} i1 The int
     */
    u1i(name: string, i1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);
        
        if (loc == -1) {
            return;
        }

        gl.uniform1i(loc, i1);
    }

    /**
     * Sets an 2 integer uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} i1 The first int
     * @param {number} i2 The second int
     */
    u2i(name: string, i1: number, i2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform2i(loc, i1, i2);
    }

    /**
     * Sets an 3 integer uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} i1 The first int
     * @param {number} i2 The second int
     * @param {number} i3 The third int
     */
    u3i(name: string, i1: number, i2: number, i3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform3i(loc, i1, i2, i3);
    }

    /**
     * Sets an 4 integer uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} i1 The first int
     * @param {number} i2 The second int
     * @param {number} i3 The third int
     * @param {number} i4 The fourth int
     */
    u4i(name: string, i1: number, i2: number, i3: number, i4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform4i(loc, i1, i2, i3, i4);
    }

    /**
     * Sets an float uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} f1 The float
     */
    u1f(name: string, f1: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform1f(loc, f1);
    }

    /**
     * Sets an 2 float uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} f1 The first float
     * @param {number} f2 The second float
     */
    u2f(name: string, f1: number, f2: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform2f(loc, f1, f2);
    }

    /**
     * Sets an 3 float uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} f1 The first float
     * @param {number} f2 The second float
     * @param {number} f3 The third float
     */
    u3f(name: string, f1: number, f2: number, f3: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform3f(loc, f1, f2, f3);
    }

    /**
     * Sets an 4 float uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {number} f1 The first float
     * @param {number} f2 The second float
     * @param {number} f3 The third float
     * @param {number} f4 The fourth float
     */
    u4f(name: string, f1: number, f2: number, f3: number, f4: number) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform4f(loc, f1, f2, f3, f4);
    }

    /**
     * Sets an boolean uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {boolean} b1 The boolean
     */
    u1b(name: string, b1: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform1i(loc, b1 ? 1 : 0);
    }

    /**
     * Sets an 2 boolean uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {boolean} b1 The first boolean
     * @param {boolean} b2 The second boolean
     */
    u2b(name: string, b1: boolean, b2: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform2i(loc, b1 ? 1 : 0, b2 ? 1 : 0);
    }

    /**
     * Sets an 3 boolean uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {boolean} b1 The first boolean
     * @param {boolean} b2 The second boolean
     * @param {boolean} b3 The third boolean
     */
    u3b(name: string, b1: boolean, b2: boolean, b3: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform3i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0);
    }

    /**
     * Sets an 4 boolean uniform variable for an uniform with the given name.
     * @param {string} name The uniform location name
     * @param {boolean} b1 The first boolean
     * @param {boolean} b2 The second boolean
     * @param {boolean} b3 The third boolean
     * @param {boolean} b4 The fourth boolean
     */
    u4b(name: string, b1: boolean, b2: boolean, b3: boolean, b4: boolean) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform4i(loc, b1 ? 1 : 0, b2 ? 1 : 0, b3 ? 1 : 0, b4 ? 1 : 0);
    }

    /**
     * Sets an vector2 uniform variable for an uniform with the given name. Each component is assumed to be a floating point number.
     * The expected WebGL data type is `vec2`
     * @param {string} name The uniform location name
     * @param {Vector2} vec The vector2 object
     */
    uvec2(name: string, vec: Vector2) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform2f(loc, vec.x, vec.y);
    }

    /**
     * Sets an vector3 uniform variable for an uniform with the given name. Each component is assumed to be a floating point number.
     * The expected WebGL data type is `vec3`
     * @param {string} name The uniform location name
     * @param {Vector3} vec The vector3 object
     */
    uvec3(name: string, vec: Vector3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform3f(loc, vec.x, vec.y, vec.z);
    }

    /**
     * Sets an matrix3 uniform variable for an uniform with the given name. Each component is assumed to be a floating point number.
     * The expected WebGL data type is `mat3`.
     * @param {string} name The uniform location name
     * @param {Matrix3} mat The matrix3 object
     */
    umat3(name: string, mat: Matrix3) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniformMatrix3fv(loc, false, mat.values);
    }

    /**
     * Sets an matrix4 uniform variable for an uniform with the given name. Each component is assumed to be a floating point number.
     * The expected WebGL data type is `mat4`.
     * @param {string} name The uniform location name
     * @param {Matrix4} mat The matrix4 object
     */
    umat4(name: string, mat: Matrix4) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniformMatrix4fv(loc, false, mat.values);
    }

    /**
     * Sets an color uniform variable for an uniform with the given name. Each component is assumed to be a integer number.
     * The expected WebGL data type is `vec4`. This function also normalizes the RGBA values to a value ranging from 0..1 as WebGL expects it.
     * @param {string} name The uniform location name
     * @param {Color} color The color object
     */
    ucolor(name: string, color: Color) {
        const gl = Aquanore.ctx;
        const loc = gl.getUniformLocation(this._id, name);

        if (loc == -1) {
            return;
        }

        gl.uniform4f(loc, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
    }
}