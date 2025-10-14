import { RigidBody } from "@dimforge/rapier3d-compat";
import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Color, Font, Renderer, Scene } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Cursor, Keyboard } from "../../aquanore/input";
import { MathHelper, Matrix4, Vector2, Vector3 } from "../../aquanore/math";
import { Physics } from "../../aquanore/physics";

import { ActorCube } from "./actor-cube";
import { ActorFloor } from "./actor-floor";
import { ActorPlayer } from "./actor-player";
import { RapierUtils } from "../../aquanore/physics/rapier-utils";

let cubes: ActorCube[];
let floor: ActorFloor;
let player: ActorPlayer;
let font: Font;

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
    await initFont();
    await initActors();
    await initScene();
}

async function onUpdate(dt: number) {
    await updateControls(dt);
    await updateScene(dt);
}

async function onRender2D() {
    await renderGui();
}

async function onRender3D() {
    await renderScene();
}

async function onResize() {

}

/* INIT */
async function initFont() {
    font = new Font(20, "Arial");
}

async function initActors() {
    cubes = [];
    floor = new ActorFloor();
    player = new ActorPlayer();
}

async function initScene() {
    Scene.lights[0].source = new Vector3(1, 2, 1);
    Scene.camera.translation = new Vector3(0, 30, -30);
    Scene.camera.rotation = new Vector3(MathHelper.radians(45), 0, 0);
}

/* UPDATE */
async function updateScene(dt: number) {
    await player.update(dt);

    for (let i = 0; i < cubes.length; i++) {
        await cubes[i].update();

        if (cubes[i].removed) {
            cubes.splice(i, 1);
        }
    }
}

async function updateControls(dt: number) {
    if (Keyboard.keyPressed(Keys.R)) {
        for (let cube of cubes) {
            cube.collider.remove();
        }

        cubes = [];

        player.body.position = new Vector3(0, 2, 0);
        player.body.rotation = new Vector3(0, 0, 0);
        player.body.linearVelocity = new Vector3(0, 0, 0);
        player.body.angularVelocity = new Vector3(0, 0, 0);
    }

    if (Cursor.isButtonPressed(0)) {
        const coords = new Vector2(Cursor.x, Cursor.y);
        const origin = Vector3.unproject(coords, Scene.camera)
        const dir = Vector3.unprojectDir(coords, Scene.camera);
        const raycast = Physics.raycast(origin, dir, 100, true);
        const cube = cubes.find(x => x.collider.handle == raycast?.handle);

        if (cube != null) {
            const i = cubes.indexOf(cube);
            cube.collider.remove();
            cubes.splice(i, 1);
        }
    }

    if (Cursor.isButtonPressed(2)) {
        const coords = new Vector2(Cursor.x, Cursor.y);

        let origin = Vector3.unproject(coords, Scene.camera)
        let dir = Vector3.unprojectDir(coords, Scene.camera);
        let raycast = Physics.raycast(origin, dir, 100, true);

        if (raycast != null) {
            const pos = raycast.point;
            pos.y += 1;

            const cube = new ActorCube();
            cube.position = pos;

            cubes.push(cube);
        }
    }
}

/* RENDER */
async function renderGui() {
    drawText(`POS: ${Vector3.round(player.body.position)}`, 32, 32);
    drawText(`CUBES: ${cubes.length}`, 32, 64);
}

async function renderScene() {
    for (let cube of cubes) {
        await cube.render();
    }

    await floor.render();
    await player.render();
}

/* HELPER FUNCTIONS */
function drawText(text: string, x: number, y: number) {
    const pos = new Vector2(x, y);
    const scale = new Vector2(1, 1);
    const color = new Color(255, 255, 255);

    Renderer.drawText(font, text, pos, scale, color);
}