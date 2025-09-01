export abstract class Geometry {
    get vao(): WebGLVertexArrayObject;
    get vertices(): number[];
    get normals(): number[];
    get uvs(): number[];
    get indices(): number[];
    get tangents(): number[];
    get bitangents(): number[];
    set vertices(value: number[]);
    set normals(value: number[]);
    set uvs(value: number[]);
    set indices(value: number[]);
    set tangents(value: number[]);
    set bitangents(value: number[]);

    protected updateArrays(): void;
    protected generateBuffers(): void;
}