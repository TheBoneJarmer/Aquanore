export interface IGeometry {
    get vertices(): number[];
    get normals(): number[];
    get uvs(): number[];
    get indices(): number[];
}