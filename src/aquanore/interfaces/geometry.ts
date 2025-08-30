export interface IGeometry {
    get vao(): WebGLVertexArrayObject;
    get vertices(): number[];
    get normals(): number[];
    get uvs(): number[];
    get indices(): number[];
    get tangents(): number[];
    get bitangents(): number[];
}