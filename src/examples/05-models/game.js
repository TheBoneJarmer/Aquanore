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
let animation = null;
let animationTime = 0;
let animationPaused = false;

Aquanore.init();
Aquanore.clearColor = new Color(55, 55, 55);

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -4;
    cam.position.y = -1;

    lights[0] = new Light(LightType.Directional);

    let loader = new GltfLoader();
    model = await loader.load("mage.glb");
    animation = model.animations.find(x => x.name == "Idle");

    // model = await loader.load("debug.gltf");
    // model.data.forEach((child) => {
    //     if (child instanceof Mesh) {
    //         child.primitives[0].material = new BasicMaterial();
    //     }
    // });
    // animation = model.animations[0];

    // model = await loader.load("axis.glb");
    // animation = model.animations[0];
    // scale = new Vector3(0.25, 0.25, 0.25);

    console.log(model);
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;
    
    if (!animationPaused) {
        animationTime += dt;
    }

    if (animationTime > animation.getDuration()) {
        animationTime = 0;
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

    if (Keyboard.keyPressed(Keys.Space)) {
        animationPaused = !animationPaused;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale, animation, animationTime);
    //Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

Aquanore.run();