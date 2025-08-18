import { Aquanore } from "../../aquanore/aquanore";
import { Camera } from "../../aquanore/camera";
import { Model } from "../../aquanore/model";
import { Renderer } from "../../aquanore/renderer";
import { Vector3 } from "../../aquanore/vector3";

let model: Model | null = null;
let cam: Camera | null = null;
let pos: Vector3 | null = null;
let rot: Vector3 | null = null;
let scale: Vector3 | null = null;

Aquanore.init();

Aquanore.onLoad = () => {
    model = Model.cube(1);
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000.0);
    pos = new Vector3();
    rot = new Vector3();
    scale = new Vector3(1, 1, 1);
};

Aquanore.onUpdate = (dt: number) => {
    cam!.position.z = -5;
    cam!.aspect = innerWidth / innerHeight;

    rot!.y += dt * 0.01;
    rot!.x += dt * 0.01;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model!, cam!, pos!, rot!, scale!);
};

Aquanore.run();
