import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Scene } from "../../aquanore/graphics";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";

import { ActorCube } from "./actor-cube";
import { ActorFloor } from "./actor-floor";

let cubes: ActorCube[];
let floor: ActorFloor;
let timer: number;

const options = new AquanoreOptions();
// options.shadow.enabled = false;

await Aquanore.init(options);
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    await initScene();
    await initActors();
}

async function onUpdate(dt: number) {
    await updateControls(dt);
    await updateScene(dt);
}

async function onRender2D() {

}

async function onRender3D() {
    await renderScene();
}

async function onResize() {

}

/* INIT */
async function initActors() {
    cubes = [];
    floor = new ActorFloor();
    timer = 0;
}

async function initScene() {
    Scene.camera.translation = new Vector3(0, 5, -5);
    Scene.camera.rotation = new Vector3(MathHelper.radians(45), 0, 0);

    Scene.lights[0].source = new Vector3(1, 2, 1);
}

/* UPDATE */
async function updateScene(dt: number) {
    if (timer < 10) {
        timer += 1;
    } else {
        const pos = new Vector3();
        pos.x = -5 + Math.random() * 10;
        pos.z = -5 + Math.random() * 10;
        pos.y = 10 + Math.random() * 10;

        const cube = new ActorCube();
        cube.position = pos;

        cubes.push(cube);
        timer = 0;
    }

    for (let i=0; i<cubes.length; i++) {
        await cubes[i].update();

        if (cubes[i].removed) {
            cubes.splice(i, 1);
        }
    }
}

async function updateControls(dt: number) {
    const moveSpeed = dt * 10;
    const rotSpeed = dt * 5;
    const cam = Scene.camera;

    if (Keyboard.keyDown(Keys.A)) {
        const deg = MathHelper.degrees(cam.rotation.y);
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.translation.x += x * moveSpeed;
        cam.translation.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.D)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 180;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.translation.x += x * moveSpeed;
        cam.translation.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.W)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 90;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.translation.x += x * moveSpeed;
        cam.translation.z += y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.S)) {
        const deg = MathHelper.degrees(cam.rotation.y) + 90;
        const x = Math.cos(MathHelper.radians(deg));
        const y = Math.sin(MathHelper.radians(deg));

        cam.translation.x -= x * moveSpeed;
        cam.translation.z -= y * moveSpeed;
    }

    if (Keyboard.keyDown(Keys.Q)) cam.translation.y -= moveSpeed;
    if (Keyboard.keyDown(Keys.E)) cam.translation.y += moveSpeed;
    if (Keyboard.keyDown(Keys.Left)) cam.rotation.y -= rotSpeed;
    if (Keyboard.keyDown(Keys.Right)) cam.rotation.y += rotSpeed;
    if (Keyboard.keyDown(Keys.Up)) cam.rotation.x -= rotSpeed;
    if (Keyboard.keyDown(Keys.Down)) cam.rotation.x += rotSpeed;
}

/* RENDER */
async function renderScene() {
    for (let cube of cubes) {
        await cube.render();
    }

    await floor.render();
}