import { Quaternion, Vector3 } from "../math";

export type AnimationChannelPath = "translation" | "scale" | "rotation";
export type AnimationChannelInterpolation = "STEP" | "LINEAR" | "CUBICSPLINE";

export class ModelAnimationChannel {
    private _path: AnimationChannelPath;
    private _interpolation: AnimationChannelInterpolation;
    private _input: number[];
    private _output: (Vector3  | Quaternion)[];
    private _index: number;

    get path(): AnimationChannelPath {
        return this._path;
    }

    set path(value: AnimationChannelPath) {
        this._path = value;
    }

    get input(): number[] {
        return this._input;
    }

    set input(value: number[]) {
        this._input = value;
    }

    get output(): (Vector3  | Quaternion)[] {
        return this._output;
    }

    set output(value: (Vector3  | Quaternion)[]) {
        this._output = value;
    }

    get index(): number {
        return this._index;
    }

    set index(value: number) {
        this._index = value;
    }

    get interpolation(): AnimationChannelInterpolation {
        return this._interpolation;
    }

    set interpolation(value: AnimationChannelInterpolation) {
        this._interpolation = value;
    }

    constructor() {
        this._path = "translation";
        this._interpolation = "STEP";
        this._input = [];
        this._output = [];
        this._index = 0;
    }
}