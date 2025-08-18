import { Aquanore } from "../../aquanore/aquanore";
import { Camera } from "../../aquanore/camera";
import { Mesh } from "../../aquanore/mesh";
import { Model } from "../../aquanore/model";
import { Renderer } from "../../aquanore/renderer";
import { Vector3 } from "../../aquanore/vector3";

let model = new Model();
let cam = new Camera();
let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);

Aquanore.init();

Aquanore.onLoad = () => {
    const verts = [
        1, 1, -1,
        1, -1, -1,
        1, 1, 1,
        1, -1, 1,
        -1, 1, -1,
        -1, -1, -1,
        -1, 1, 1,
        -1, -1, 1
    ];

    const normals = [
        0.58, 0.58, -0.58,
        0.58, -0.58, -0.58,
        0.58, 0.58, 0.58,
        0.58, -0.58, 0.58,
        -0.58, 0.58, -0.58,
        -0.58, -0.58, -0.58,
        -0.58, 0.58, 0.58,
        -0.58, -0.58, 0.58
    ];

    const tc = [
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0
    ];

    const indices = [
        4, 2, 0,
        2, 7, 3,
        6, 5, 7,
        1, 7, 5,
        0, 3, 1,
        4, 1, 5,
        4, 6, 2,
        2, 6, 7,
        6, 4, 5,
        1, 3, 7,
        0, 2, 3,
        4, 0, 1
    ];

    const mesh = new Mesh(verts, tc, normals, indices);
    model.meshes.push(mesh);
};

Aquanore.onUpdate = (dt: number) => {
    cam.position.z = -5;

    rot.y += dt * 0.01;
    rot.x += dt * 0.01;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, pos, rot, scale);
};

Aquanore.run();
