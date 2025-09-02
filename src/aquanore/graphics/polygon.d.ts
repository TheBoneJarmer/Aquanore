export class Polygon {
    get vao(): WebGLVertexArrayObject;
    get vertices(): number[];
    get uvs(): number[];

    constructor(vertices: number[], uvs: number[]);

    static square(size: number): Polygon;
    static rectangle(width: number, height: number): Polygon;
}