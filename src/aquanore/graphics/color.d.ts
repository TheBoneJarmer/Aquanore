export class Color {
    get r(): number;
    set r(value: number);
    get g(): number;
    set g(value: number);
    get b(): number;
    set b(value: number);
    get a(): number;
    set a(value: number);

    constructor(r?: number, g?: number, b?: number, a?: number);

    clone(): Color;
}