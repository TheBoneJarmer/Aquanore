import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Scene } from "../../aquanore/graphics";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { Physics } from "../../aquanore/physics";

import { ActorCube } from "./actor-cube";
import { ActorFloor } from "./actor-floor";
import { ActorPlayer } from "./actor-player";

let cubes: ActorCube[];
let floor: ActorFloor;
let player: ActorPlayer;

const options = new AquanoreOptions();
options.shadow.map.width *= 2;
options.shadow.map.height *= 2;

options.shadow.frustrum.bottom *= 2;
options.shadow.frustrum.top *= 2;
options.shadow.frustrum.left *= 2;
options.shadow.frustrum.right *= 2;
options.shadow.frustrum.near *= 2;
options.shadow.frustrum.far *= 2;

await Aquanore.init(options);
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    await initActors();
    await initScene();
}

async function onUpdate(dt: number) {
    // await updateControls(dt);
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
    player = new ActorPlayer();
}

async function initScene() {
    Scene.lights[0].source = new Vector3(1, 2, 1);

    for (let i=0; i<25; i++) {
        const pos = new Vector3();
        pos.x = -25 + Math.random() * 50;
        pos.y = 3;
        pos.z = -25 + Math.random() * 50;

        const rot = new Vector3();
        rot.y = MathHelper.radians(Math.random() * 360);

        const cube = new ActorCube();
        cube.position = pos;
        cube.rotation = rot;

        cubes.push(cube);
    }
}

/* UPDATE */
async function updateScene(dt: number) {
    await player.update(dt);

    for (let i=0; i<cubes.length; i++) {
        await cubes[i].update();

        if (cubes[i].removed) {
            cubes.splice(i, 1);
        }
    }
}

/* RENDER */
async function renderScene() {
    for (let cube of cubes) {
        await cube.render();
    }

    await floor.render();
    await player.render();
}