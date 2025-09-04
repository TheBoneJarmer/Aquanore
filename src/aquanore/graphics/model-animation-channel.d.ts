import { Quaternion, Vector3 } from "../math";

export type AnimationChannelPath = "translation" | "rotation" | "scale";
export type AnimationChannelOutput = Vector3[] | Quaternion[];
export type AnimationChannelInterpolation = "LINEAR" | "STEP";

export class ModelAnimationChannel {
    get path(): AnimationChannelPath;
    set path(value: AnimationChannelPath);
    get input(): number[];
    set input(value: number[]);
    get output(): AnimationChannelOutput;
    set output(value: AnimationChannelOutput);
    get index(): number;
    set index(value: number);
    get interpolation(): AnimationChannelInterpolation;
    set interpolation(value: AnimationChannelInterpolation);

    constructor();
}