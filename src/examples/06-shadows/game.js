import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Color, Model, Polygon, Renderer, Scene } from "../../aquanore/graphics";
import { Shader, Shaders, ShaderSources } from "../../aquanore/graphics/shaders";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector2, Vector3 } from "../../aquanore/math";

let modelCube = null;
let modelSphere = null;
let modelCylinder = null;
let modelFloor = null;
let poly = null;

let rotation = null;
let scale = null;
let toggle = false;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    Aquanore.info();

    await initModels();
    await initScene();
}

async function onUpdate(dt) {
    await updateScene(dt);
    await updateControls(dt);
    await updateUI(dt);
}

async function onRender2D() {
    await render2D();
}

async function onRender3D() {
    await render3D();
}

async function onResize() {

}

/* INIT */
async function initScene() {
    Scene.camera.position.z = -10;
    Scene.camera.position.y = 5;
    Scene.camera.rotation.x = MathHelper.radians(25);

    Scene.lights[0].source = new Vector3(5, 5, 5);

    rotation = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);

    poly = Polygon.rectangle(innerWidth, innerHeight);
}

async function initModels() {
    modelFloor = Model.box(30, 0.1, 30);
    modelCube = Model.cube();
    modelCylinder = Model.cylinder();
    modelSphere = Model.sphere();

    // Change the color of the floor
    modelFloor.meshes.forEach((mesh) => {
        mesh.primitives[0].material.color = new Color(35, 200, 35);
    });
}

/* UPDATE */
async function updateScene(dt) {
    const speed = dt;

    rotation.x += speed;
    rotation.y += speed;
    rotation.z += speed;

    if (Keyboard.keyPressed(Keys.T)) {
        toggle = !toggle;
    }
}

async function updateUI(dt) {
    const cam = Scene.camera;
    const el = document.querySelector("#info");

    const elPos = document.createElement("span");
    elPos.innerHTML += `<b>CAM POS: </b>`;
    elPos.innerHTML += `X: ${Math.round(cam.position.x).toString().padStart(3, "0")} `;
    elPos.innerHTML += `Y: ${Math.round(cam.position.y).toString().padStart(3, "0")} `;
    elPos.innerHTML += `Z: ${Math.round(cam.position.z).toString().padStart(3, "0")}`;

    const elRot = document.createElement("span");
    elRot.innerHTML += `<b>CAM ROT: </b>`;
    elRot.innerHTML += `X: ${Math.round(MathHelper.degrees(cam.rotation.x)).toString().padStart(3, "0")} `;
    elRot.innerHTML += `Y: ${Math.round(MathHelper.degrees(cam.rotation.y)).toString().padStart(3, "0")} `;
    elRot.innerHTML += `Z: ${Math.round(MathHelper.degrees(cam.rotation.z)).toString().padStart(3, "0")}`;

    const elFps = document.createElement("span");
    elFps.innerHTML += `<b>FPS: </b>`;
    elFps.innerHTML += `${Math.round(dt * 1000) / 1000}`;

    el.innerHTML = "";
    el.appendChild(elPos);
    el.appendChild(elRot);
    el.appendChild(elFps);
}

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

    if (Keyboard.keyDown(Keys.Q)) cam.position.y -= moveSpeed * 4;
    if (Keyboard.keyDown(Keys.E)) cam.position.y += moveSpeed * 4;
    if (Keyboard.keyDown(Keys.Left)) cam.rotation.y -= rotSpeed;
    if (Keyboard.keyDown(Keys.Right)) cam.rotation.y += rotSpeed;
    if (Keyboard.keyDown(Keys.Up)) cam.rotation.x -= rotSpeed;
    if (Keyboard.keyDown(Keys.Down)) cam.rotation.x += rotSpeed;
}

/* RENDER */
async function render2D() {
    const pos = new Vector2(0,0);
    const scale = new Vector2(1,1);
    const origin = new Vector2(0,0);
    const color = new Color(255, 255, 255);

    if (toggle) {
        Renderer.drawPolygon(poly, pos, scale, origin, 0, color, Renderer.shadowmap);
    }
}

async function render3D() {
    const posFloor = new Vector3(0, -3, 0);
    const rotFloor = new Vector3(0, 0, 0);
    const posCube = new Vector3(-3, 0, 0);
    const posCylinder = new Vector3(0, 0, 0);
    const posSphere = new Vector3(3, 0, 0);

    Renderer.drawModel(modelFloor, posFloor, rotFloor, scale);
    Renderer.drawModel(modelCube, posCube, rotation, scale);
    Renderer.drawModel(modelCylinder, posCylinder, rotation, scale);
    Renderer.drawModel(modelSphere, posSphere, rotation, scale);
}
