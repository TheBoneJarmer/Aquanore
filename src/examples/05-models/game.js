import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Light, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";

let model = null;
let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);

await Aquanore.init();

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -5;
    cam.position.y = -4;
    cam.rotation.x = MathHelper.radians(35);

    lights[0] = new Light(LightType.Directional);

    let loader = new GltfLoader();
    model = await loader.load("mage.glb");
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;

    rot.y += dt * 0.1;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

await Aquanore.run();
