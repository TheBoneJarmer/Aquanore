import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Polygon, Renderer, Scene } from "../../aquanore/graphics";
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
    Scene.camera.position.z = -8;
    Scene.camera.position.y = -7;
    Scene.camera.rotation.x = MathHelper.radians(45);

    rotation = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);

    poly = Polygon.rectangle(innerWidth, innerHeight);
}

async function initModels() {
    modelFloor = Model.box(10, 0.1, 10);
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
    rotation.x += dt;
    rotation.y += dt;
    rotation.z += dt;
}

/* RENDER */
async function render2D() {
    const polyPos = new Vector2(0, 0);
    const polyScale = new Vector2(1, 1);
    const polyOrigin = new Vector2(0, 0);
    const polyColor = new Color(255, 255, 255);

    Renderer.drawPolygon(poly, polyPos, polyScale, polyOrigin, 0, polyColor, Renderer.shadowMap);
}

async function render3D() {
    const posFloor = new Vector3(0, 0, 0);
    const rotFloor = new Vector3(0, 0, 0);
    const posCube = new Vector3(-3, 2, 0);
    const posCylinder = new Vector3(0, 2, 0);
    const posSphere = new Vector3(3, 2, 0);

    Renderer.drawModel(modelFloor, posFloor, rotFloor, scale);
    Renderer.drawModel(modelCube, posCube, rotation, scale);
    Renderer.drawModel(modelCylinder, posCylinder, rotation, scale);
    Renderer.drawModel(modelSphere, posSphere, rotation, scale);
}
