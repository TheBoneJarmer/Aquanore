import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Renderer } from "../../aquanore/graphics";
import { Vector3 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Cursor, Keyboard } from "../../aquanore/input";

let model = null;

let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);

let animation = null;
let index = 0;
let time = 0;
let paused = false;

Aquanore.init();
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
}

async function onRender3D() {
    await renderGltf();
}

/* INIT */
async function initScene() {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -4;

    lights[0] = new Light(LightType.Directional);

    Aquanore.clearColor = new Color(55, 55, 55);
}

async function initModels() {
    let loader = new GltfLoader();
    model = await loader.load("models/Skeleton_Mage.glb");

    if (model.animations.length > 0) {
        animation = model.animations[index];
        console.log(animation.name);
    }
}

/* UPDATE */
async function updateInput(dt) {
    if (Keyboard.keyDown(Keys.W)) cam.position.z += dt;
    if (Keyboard.keyDown(Keys.S)) cam.position.z -= dt;
    if (Keyboard.keyDown(Keys.A)) cam.position.x += dt;
    if (Keyboard.keyDown(Keys.D)) cam.position.x -= dt;
    if (Keyboard.keyDown(Keys.Q)) cam.position.y -= dt;
    if (Keyboard.keyDown(Keys.E)) cam.position.y += dt;

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

    if (Cursor.isButtonDown(0)) {
        if (Cursor.moveX > 0) rot.y -= dt * 4;
        if (Cursor.moveX < 0) rot.y += dt * 4;
        if (Cursor.moveY > 0) rot.x -= dt * 4;
        if (Cursor.moveY < 0) rot.x += dt * 4;
    }

    if (Cursor.wheelY > 0) {
        cam.position.z -= dt * 2;
    }

    if (Cursor.wheelY < 0) {
        cam.position.z += dt * 2;
    }
}

async function updateScene(dt) {
    cam.aspect = innerWidth / innerHeight;
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
async function renderGltf() {
    Renderer.drawModel(model, cam, lights, pos, rot, scale, animation, time);
}