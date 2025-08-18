import { Mesh } from "./mesh";

export class Model {
    public meshes: Mesh[] = [];

    /* CONSTRUCTION FUNCTIONS */
    public static cube(size: number): Model {
        const verts = [1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1];
        const normals = [0.58, 0.58, -0.58, 0.58, -0.58, -0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, -0.58, -0.58, -0.58, -0.58, -0.58, 0.58, 0.58, -0.58, -0.58, 0.58];

        const tc = [
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
        ];

        const indices = [4, 2, 0, 2, 7, 3, 6, 5, 7, 1, 7, 5, 0, 3, 1, 4, 1, 5, 4, 6, 2, 2, 6, 7, 6, 4, 5, 1, 3, 7, 0, 2, 3, 4, 0, 1];

        const mesh = new Mesh(verts, tc, normals, indices);
        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }
}