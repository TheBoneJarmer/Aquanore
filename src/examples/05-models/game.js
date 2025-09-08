import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Renderer } from "../../aquanore/graphics";
import { Vector3, Matrix4 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Keyboard } from "../../aquanore/input";

let modelGltf = null;
let modelJoint = null;
let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);

let animation = null;
let time = 0;
let paused = false;

let selected = -1;

Aquanore.init();
Aquanore.clearColor = new Color(55, 55, 55);

Aquanore.onLoad = async () => {
    await initScene();
    await initModels();
};

Aquanore.onUpdate = async (dt) => {
    await updateScene(dt);
    await updateAnimation(dt);
    await updateInput(dt);
};

Aquanore.onRender2D = async () => {

};

Aquanore.onRender3D = async () => {
    await renderGltf();
    await renderJoints();
};

Aquanore.run();

/* INIT */
async function initScene() {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -0.5;

    lights[0] = new Light(LightType.Directional);
}

async function initModels() {
    let loader = new GltfLoader();
    modelGltf = await loader.load("mage.glb");
    modelJoint = await loader.load("axis.glb");
    animation = modelGltf.animations.find(x => x.name == "T-Pose");

    // Modify the joint model to scale down a lot
    modelJoint.meshes.forEach((mesh) => {
        mesh.scale = new Vector3(0.02, 0.02, 0.02);
    });

    // modelGltf = await loader.load("debug.gltf");
    // modelGltf.meshes.forEach((mesh) => {
    //     mesh.primitives[0].material = new BasicMaterial();
    // });
    // animation.index = modelGltf.animations[0];

    console.log(modelGltf);
}

/* UPDATE */
async function updateInput(dt) {
    if (Keyboard.keyDown(Keys.W)) rot.x -= dt;
    if (Keyboard.keyDown(Keys.S)) rot.x += dt;
    if (Keyboard.keyDown(Keys.A)) rot.y -= dt;
    if (Keyboard.keyDown(Keys.D)) rot.y += dt;

    if (Keyboard.keyPressed(Keys.PageUp)) {
        selected++;
        await onSelelectJoint();
    }

    if (Keyboard.keyPressed(Keys.PageDown)) {
        selected--;
        await onSelelectJoint();
    }

    if (Keyboard.keyPressed(Keys.R)) {
        rot.x = 0;
        rot.y = 0;
        selected = -1;
    }

    if (Keyboard.keyPressed(Keys.Space)) {
        paused = !paused;
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
    //Renderer.drawModel(modelGltf, cam, lights, pos, rot, scale, animation, time);
}

async function renderJoints() {
    const skin = modelGltf.skins[0];

    for (let i = 0; i < skin.joints.length; i++) {
        const joint = modelGltf.joints.find(x => x.index == skin.joints[i]);
        const matInverse = skin.matrices[i];
        const matGlobal = Renderer.getGlobalTransform(modelGltf, joint.index, animation, time);

        let matLocal = Matrix4.identity();
        matLocal = Matrix4.translate(matLocal, joint.translation.x, joint.translation.y, joint.translation.z);
        matLocal = Matrix4.rotate(matLocal, joint.rotation.x, joint.rotation.y, joint.rotation.z);
        matLocal = Matrix4.scale(matLocal, joint.scale.x, joint.scale.y, joint.scale.z);

        let matWorld = Matrix4.identity();
        matWorld = Matrix4.scale(matWorld, scale.x, scale.y, scale.z);
        matWorld = Matrix4.rotate(matWorld, rot.x, rot.y, rot.z);
        matWorld = Matrix4.translate(matWorld, pos.x, pos.y, pos.z);

        let mat = Matrix4.identity();
        mat = Matrix4.multiply(mat, matWorld);
        mat = Matrix4.multiply(mat, matLocal);
        mat = Matrix4.multiply(mat, matGlobal);
        //mat = Matrix4.multiply(mat, matInverse);

        let jointTranslation = Matrix4.extractTranslation(mat);
        let jointRotation = Matrix4.extractRotation(mat);
        let jointScale = Matrix4.extractScale(mat);

        if (selected == skin.joints[i]) {
            jointScale.x *= -1;
            jointScale.y *= -1;
            jointScale.z *= -1;

            Renderer.drawModel(modelJoint, cam, lights, jointTranslation, jointRotation, jointScale);
        } else {
            Renderer.drawModel(modelJoint, cam, lights, jointTranslation, jointRotation, jointScale);
        }
    }
}

/* CALLBACKS */
async function onSelelectJoint() {
    if (selected >= modelGltf.joints.length) {
        selected = 0;
    }

    if (selected < 0) {
        selected = modelGltf.joints.length - 1;
    }

    const joint = modelGltf.joints[selected];

    console.log(`[JOINT ${selected}]`);
    console.log(`Translation: ${joint.translation.x} ${joint.translation.y} ${joint.translation.z}`);
    console.log(`Rotation: ${joint.rotation.x} ${joint.rotation.y} ${joint.rotation.z}`);
    console.log(`Scale: ${joint.scale.x} ${joint.scale.y} ${joint.scale.z}`);
}