import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Light, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Keyboard} from "../../aquanore/input";

let model = null;
let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);

Aquanore.init();

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -1;

    lights[0] = new Light(LightType.Directional);

    let loader = new GltfLoader();
    model = await loader.load("mage.glb");
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;

    if (Keyboard.keyDown(Keys.Up)) {
        rot.x -= dt;
    }

    if (Keyboard.keyDown(Keys.Down)) {
        rot.x += dt;
    }

    if (Keyboard.keyDown(Keys.Left)) {
        rot.y -= dt;
    }

    if (Keyboard.keyDown(Keys.Right)) {
        rot.y += dt;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

Aquanore.run();