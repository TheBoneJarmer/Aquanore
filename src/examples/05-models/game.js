import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Mesh, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Keyboard } from "../../aquanore/input";
import { BasicMaterial } from "../../aquanore/graphics/materials";

let model = null;
let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);
let time = 0;
let anim = 0;

Aquanore.init();
Aquanore.clearColor = new Color(55, 55, 55);

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -8;
    cam.position.y = 0;

    lights[0] = new Light(LightType.Directional);

    let loader = new GltfLoader();
    model = await loader.load("debug.gltf");

    for (let mesh of model.meshes) {
        for (let pri of mesh.primitives) {
            pri.material = new BasicMaterial();
        }
    }

    console.log(model);
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;
    time += dt / 5;

    if (time > model.animations[anim].getDuration()) {
        time = 0;
    }

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

    if (Keyboard.keyPressed(Keys.R)) {
        rot.x = 0;
        rot.y = 0;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    // Renderer.drawModel(model, cam, lights, pos, rot, scale, model.animations[anim], time);
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

Aquanore.run();