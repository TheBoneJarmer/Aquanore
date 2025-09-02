import { Color } from "./color";

export class Light {
    get type(): number;
    set type(value: number);
    get source(): number;
    set source(value: number);
    get color(): Color;
    set color(value: Color);
    get enabled(): boolean;
    set enabled(value: boolean);
    get range(): number;
    set range(value: number);
    get strength(): number;
    set strength(value: number);

    constructor(type: number);
}