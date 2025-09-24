import { Aquanore } from "../../aquanore/aquanore";
import { AquanoreOptions } from "../../aquanore/aquanore-options";
import { Keys } from "../../aquanore/enums";
import { Color, Model, Renderer, Scene } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";

let modelFloor: Model;
let modelCube: Model;
let modelSphere: Model;
let modelCylinder: Model;

let angle = 0;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;
Aquanore.run();

/* UPDATE */
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

/* CALLBACKS */
async function onLoad() {
    modelCube = Model.cube();
    modelSphere = Model.sphere();
    modelCylinder = Model.cylinder();

    modelFloor = Model.box(20, 0.1, 20);
    modelFloor.meshes.forEach((mesh) => {
        const mat = mesh.primitives[0].material as StandardMaterial;
        mat.color = new Color(35, 185, 35);
    });

    Scene.camera.translation = new Vector3(0, 10, -10);
    Scene.camera.rotation = new Vector3(MathHelper.radians(45), 0, 0);

    Scene.lights[0].source = new Vector3(1,1,1);
}

async function onUpdate(dt: number) {
    angle += dt;

    updateControls(dt);
}

async function onRender2D() {

}

async function onRender3D() {
    Renderer.drawModel(modelFloor, new Vector3(0, -3, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    Renderer.drawModel(modelCube, new Vector3(-5, 0, 0), new Vector3(angle, angle, angle), new Vector3(1, 1, 1));
    Renderer.drawModel(modelSphere, new Vector3(0, 0, 0), new Vector3(angle, angle, angle), new Vector3(1, 1, 1));
    Renderer.drawModel(modelCylinder, new Vector3(5, 0, 0), new Vector3(angle, angle, angle), new Vector3(1, 1, 1));
}

async function onResize() {

}