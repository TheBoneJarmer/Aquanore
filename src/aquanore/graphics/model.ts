import { Mesh } from "./mesh";

export class Model {
    public meshes: Mesh[] = [];

    /* CONSTRUCTION FUNCTIONS */
    public static cube(size: number): Model {
        const verts: number[] = [-size, size, -size, size, size, size, size, size, -size, size, size, size, -size, -size, size, size, -size, size, -size, size, size, -size, -size, -size, -size, -size, size, size, -size, -size, -size, -size, size, -size, -size, -size, size, size, -size, size, -size, size, size, -size, -size, -size, size, -size, size, -size, -size, -size, -size, -size, -size, size, -size, -size, size, size, size, size, size, size, size, size, -size, size, size, -size, -size, size, -size, size, size, -size, size, -size, -size, -size, -size, size, -size, -size, size, -size, size, -size, -size, size, size, size, -size, size, size, size, size, -size, size, -size, size, -size, size, size, -size, size, -size, -size];
        const normals: number[] = [-0.58, 0.58, -0.58, 0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, 0.58, 0.58, -0.58, -0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, -0.58, -0.58, -0.58, -0.58, 0.58, 0.58, -0.58, -0.58, -0.58, -0.58, 0.58, -0.58, -0.58, -0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, -0.58, -0.58, 0.58, -0.58, 0.58, -0.58, -0.58, -0.58, -0.58, -0.58, -0.58, 0.58, -0.58, -0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, 0.58, -0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, 0.58, -0.58, -0.58, -0.58, -0.58, 0.58, -0.58, -0.58, 0.58, -0.58, 0.58, -0.58, -0.58, 0.58, 0.58, 0.58, -0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, 0.58, -0.58, -0.5];
        const texcoords: number[] = [0.88, 0.5, 0.62, 0.75, 0.62, 0.5, 0.62, 0.75, 0.38, 1.0, 0.38, 0.75, 0.62, 0.0, 0.38, 0.25, 0.38, 0.0, 0.38, 0.5, 0.12, 0.75, 0.12, 0.5, 0.62, 0.5, 0.38, 0.75, 0.38, 0.5, 0.62, 0.25, 0.38, 0.5, 0.38, 0.25, 0.88, 0.5, 0.88, 0.75, 0.62, 0.75, 0.62, 0.75, 0.62, 1.0, 0.38, 1.0, 0.62, 0.0, 0.62, 0.25, 0.38, 0.25, 0.38, 0.5, 0.38, 0.75, 0.12, 0.75, 0.62, 0.5, 0.62, 0.75, 0.38, 0.75, 0.62, 0.25, 0.62, 0.5, 0.38, 0.5];
        const indices: number[] = [];

        for (let i = 0; i < verts.length; i++) {
            indices.push(i);
        }

        const mesh = new Mesh(verts, texcoords, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }
}