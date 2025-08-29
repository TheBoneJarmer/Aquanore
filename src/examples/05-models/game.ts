import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Light, Model, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";

let model: Model = null;
let cam: Camera = null;
let lights: Light[] = [];

let pos: Vector3 = new Vector3();
let rot: Vector3 = new Vector3();
let scale: Vector3 = new Vector3(1, 1, 1);

Aquanore.init();

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -2;
    cam.rotation.x = MathHelper.radians(35);

    lights[0] = new Light(LightType.DIRECTIONAL);

    let loader = new GltfLoader();
    model = await loader.load("axis.gltf");
};

Aquanore.onUpdate = (dt: number) => {
    cam.aspect = innerWidth / innerHeight;

    rot.y += dt;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};
