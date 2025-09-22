import { Aquanore } from "../../aquanore/aquanore";
import { Keys } from "../../aquanore/enums";
import { Color, Model, PerspectiveCamera, Renderer, Scene } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { OrthoCamera } from "../../aquanore/graphics/ortho-camera";
import { Keyboard } from "../../aquanore/input";
import { ICamera } from "../../aquanore/interfaces";
import { MathHelper, Vector3 } from "../../aquanore/math";

let modelCube: Model;
let modelFloor: Model;
let cam: ICamera;
let angle: number;
let lookat: boolean;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    initModels();
    initScene();
}

async function onUpdate(dt: number) {
    updateScene(dt);
    updateControls(dt);
}

async function onRender2D() {

}

async function onRender3D() {
    renderScene();
}

async function onResize() {

}

/* INIT */
function initModels() {
    modelCube = Model.cube();
    modelFloor = Model.box(10, 0.1, 10);

    modelFloor.meshes.forEach((mesh) => {
        const mat = mesh.primitives[0].material as StandardMaterial;
        mat.color = new Color(35, 185, 35);
    });
}

function initScene() {
    angle = 0;
    lookat = true;

    generateCamera();
}

/* UPDATE */
function updateScene(dt: number) {
    angle += dt;

    if (lookat) {
        cam.lookAt(new Vector3());
    } else {
        cam.lookAt(null);
    }

    if (Keyboard.keyPressed(Keys.C)) {
        generateCamera();
    }

    if (Keyboard.keyPressed(Keys.L)) {
        lookat = !lookat;
    }
}

function updateControls(dt: number) {
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

function generateCamera() {
    if (cam instanceof PerspectiveCamera) {
        cam = new OrthoCamera(-10, 10, 10, -10, -20, 20);
    } else {
        cam = new PerspectiveCamera(60, innerWidth / innerHeight, 0.01, 1000.0);
    }

    cam.translation.z = -5;
    cam.translation.y = 3;
    cam.rotation.x = MathHelper.radians(35);

    Scene.camera = cam;
}

/* RENDER */
function renderScene() {
    const posCube = new Vector3(0, 0, 0);
    const rotCube = new Vector3(angle, angle, angle);
    const scaleCube = new Vector3(1, 1, 1);

    const posFloor = new Vector3(0, -2, 0);
    const rotFloor = new Vector3(0, 0, 0);
    const scaleFloor = new Vector3(1, 1, 1);

    Renderer.drawModel(modelCube, posCube, rotCube, scaleCube);
    Renderer.drawModel(modelFloor, posFloor, rotFloor, scaleFloor);
}