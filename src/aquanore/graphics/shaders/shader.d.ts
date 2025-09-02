import { Vector3, Vector2, Matrix3, Matrix4 } from "../../math";
import { Color } from "../color";

export class Shader {
    get id(): WebGLProgram;

    constructor(vSource: string, fSource: string);

    u1i(name: string, i1: number): void;
    u2i(name: string, i1: number, i2: number): void;
    u3i(name: string, i1: number, i2: number, i3: number): void;
    u4i(name: string, i1: number, i2: number, i3: number, i4: number): void;
    u1f(name: string, f1: number): void;
    u2f(name: string, f1: number, f2: number): void;
    u3f(name: string, f1: number, f2: number, f3: number): void;
    u4f(name: string, f1: number, f2: number, f3: number, f4: number): void;
    u1b(name: string, b1: boolean): void;
    u2b(name: string, b1: boolean, b2: boolean): void;
    u3b(name: string, b1: boolean, b2: boolean, b3: boolean): void;
    u4b(name: string, b1: boolean, b2: boolean, b3: boolean, b4: boolean): void;
    uvec2(name: string, vec: Vector2): void;
    uvec3(name: string, vec: Vector3): void;
    umat3(name: string, mat: Matrix3): void;
    umat4(name: string, mat: Matrix4): void;
    ucolor(name: string, color: Color): void;
}