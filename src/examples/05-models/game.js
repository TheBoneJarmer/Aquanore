import { Aquanore } from "../../aquanore/aquanore";
import { Keys } from "../../aquanore/enums";
import { Color, Model, Renderer, Scene } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Keyboard } from "../../aquanore/input";
import { AquanoreOptions } from "../../aquanore/aquanore-options";

let model = null;

let animation = null;
let index = 0;
let time = 0;
let paused = false;

const options = new AquanoreOptions();

Aquanore.init(options);
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender3D = onRender3D;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    await initScene();
    await initModels();
}

async function onUpdate(dt) {
    await updateScene(dt);
    await updateAnimation(dt);
    await updateInput(dt);
    await updateControls(dt);
}

async function onRender3D() {
    await renderScene();
}

/* INIT */
async function initScene() {
    Scene.camera.position.z = -4;
    Scene.camera.position.y = 1;

    Scene.lights[0].source = new Vector3(1, 1, 1);

    Renderer.clearColor = new Color(55, 55, 55);
}

async function initModels() {
    let loader = new GltfLoader();
    model = await loader.load("models/Skeleton_Mage.glb");

    if (model.animations.length > 0) {
        animation = model.animations[index];
        console.log(animation.name || "Animation");
    }
}

/* UPDATE */
async function updateControls(dt) {
    const moveSpeed = dt * 10;
    const rotSpeed = dt * 5;
    const cam = Scene.camera;

    if (Keyboard.keyDown(Keys.A)) {
        const deg = MathHelper.degrees(cam.rotation.y);
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.position.x += x * moveSpeed;
        cam.position.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.D)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 180;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.position.x += x * moveSpeed;
        cam.position.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.W)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 90;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.position.x += x * moveSpeed;
        cam.position.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.S)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 90;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.position.x -= x * moveSpeed;
        cam.position.z -= y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.Q)) cam.position.y -= moveSpeed;
    if (Keyboard.keyDown(Keys.E)) cam.position.y += moveSpeed;
    if (Keyboard.keyDown(Keys.Left)) cam.rotation.y -= rotSpeed;
    if (Keyboard.keyDown(Keys.Right)) cam.rotation.y += rotSpeed;
    if (Keyboard.keyDown(Keys.Up)) cam.rotation.x -= rotSpeed;
    if (Keyboard.keyDown(Keys.Down)) cam.rotation.x += rotSpeed;
}

async function updateInput(dt) {
    if (Keyboard.keyPressed(Keys.PageUp) && index < model.animations.length - 1) {
        index++;
        animation = model.animations[index];
        console.log(animation.name);
    }

    if (Keyboard.keyPressed(Keys.PageDown) && index > 0) {
        index--;
        animation = model.animations[index];
        console.log(animation.name);
    }

    if (Keyboard.keyPressed(Keys.Space)) {
        paused = !paused;
    }
}

async function updateScene(dt) {

}

async function updateAnimation(dt) {
    if (animation == null) {
        return;
    }

    if (!paused) {
        time += dt;
    }

    if (time > animation.getDuration()) {
        time = 0;
    }
}

/* RENDER */
async function renderScene() {
    const pos = new Vector3(0, 0, 0);
    const rot = new Vector3(0,0,0);
    const scale = new Vector3(1, 1, 1);

    Renderer.drawModel(model, pos, rot, scale, animation, time);
}