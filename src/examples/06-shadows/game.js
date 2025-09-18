import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Color, Model, Polygon, Renderer, Scene } from "../../aquanore/graphics";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector2, Vector3 } from "../../aquanore/math";

let modelCube = null;
let modelSphere = null;
let modelCylinder = null;
let modelFloor = null;
let poly = null;

let rotation = null;
let scale = null;

const options = new AquanoreOptions();
options.graphics.shadow.enabled = true;

Aquanore.init(options);
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
    Scene.camera.position.z = -15;
    Scene.camera.position.y = -15;
    Scene.camera.rotation.x = MathHelper.radians(45);

    Scene.lights[0].source = new Vector3(1, 4, 1);

    rotation = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);

    poly = Polygon.rectangle(innerWidth / 3, innerHeight / 3);
}

async function initModels() {
    modelFloor = Model.box(50, 1, 50);
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
}

async function updateControls(dt) {
    const speed = dt * 10;

    if (Keyboard.keyDown(Keys.Left)) {
        Scene.camera.position.x += speed;
    }

    if (Keyboard.keyDown(Keys.Right)) {
        Scene.camera.position.x -= speed;
    }

    if (Keyboard.keyDown(Keys.Up)) {
        Scene.camera.position.z += speed;
    }

    if (Keyboard.keyDown(Keys.Down)) {
        Scene.camera.position.z -= speed;
    }
}

/* RENDER */
async function render2D() {
    const pos = new Vector2(innerWidth - innerWidth / 3, 0);
    const scale = new Vector2(1, 1);
    const origin = new Vector2(0, 0);
    const color = new Color(255, 255, 255);

    Renderer.drawPolygon(poly, pos, scale, origin, 0, color, Renderer.shadowmap, null, false, false);
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
