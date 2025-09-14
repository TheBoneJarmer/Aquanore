import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3 } from "../../aquanore/math";

let modelCube = null;
let modelSphere = null;
let modelCylinder = null;
let modelFloor = null;

let camera = null;
let lights = null;

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
    await initModels();
    await initScene();
}

async function onUpdate(dt) {
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
async function initScene() {
    camera = new Camera(60, innerWidth / innerHeight, 0.001, 1000);
    camera.position.z = -8;
    camera.position.y = -7;
    camera.rotation.x = MathHelper.radians(45);

    lights = [];
    lights[0] = new Light(LightType.Directional);

    rotation = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);
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
    camera.aspect = innerWidth / innerHeight;

    rotation.x += dt;
    rotation.y += dt;
    rotation.z += dt;
}

/* RENDER */
async function renderScene() {
    const posFloor = new Vector3(0, 0, 0);
    const rotFloor = new Vector3(0, 0, 0);
    const posCube = new Vector3(-3, 2, 0);
    const posCylinder = new Vector3(0, 2, 0);
    const posSphere = new Vector3(3, 2, 0);

    Renderer.drawModel(modelFloor, camera, lights, posFloor, rotFloor, scale);
    Renderer.drawModel(modelCube, camera, lights, posCube, rotation, scale);
    Renderer.drawModel(modelCylinder, camera, lights, posCylinder, rotation, scale);
    Renderer.drawModel(modelSphere, camera, lights, posSphere, rotation, scale);
}
