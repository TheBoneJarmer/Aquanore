export class Matrix3 {
    get x1(): number;
    set x1(value: number);
    get y1(): number;
    set y1(value: number);
    get z1(): number;
    set z1(value: number);
    get x2(): number;
    set x2(value: number);
    get y2(): number;
    set y2(value: number);
    get z2(): number;
    set z2(value: number);
    get x3(): number;
    set x3(value: number);
    get y3(): number;
    set y3(value: number);
    get z3(): number;
    set z3(value: number);
    get values(): number[];
    set values(values: number[]);

    constructor(values: number[]);

    static identity(): Matrix3;
    static from(src: Matrix3): Matrix3;
    static transpose(mat: Matrix3): Matrix3;
    static inverse(mat: Matrix3): Matrix3;
}