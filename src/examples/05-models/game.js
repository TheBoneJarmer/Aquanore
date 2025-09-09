import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Renderer } from "../../aquanore/graphics";
import { Vector3, Matrix4, MathHelper } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Cursor, Keyboard } from "../../aquanore/input";

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
let toggle = 0;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender3D = onRender3D;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    await initScene();
    await initModels();
}

async function onUpdate(dt) {
    await updateScene(dt);
    await updateAnimation(dt);
    await updateInput(dt);
}

async function onRender3D() {
    if (toggle == 0 || toggle == 2) {
        await renderGltf();
    }

    if ((toggle == 0 || toggle == 1) && modelGltf.joints.length > 0) {
        await renderJoints();
    }
}

/* INIT */
async function initScene() {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -4;

    lights[0] = new Light(LightType.Directional);

    Aquanore.clearColor = new Color(55, 55, 55);
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

    console.log(modelGltf);
    console.log(animation);
}

/* UPDATE */
async function updateInput(dt) {
    if (Keyboard.keyDown(Keys.W)) cam.position.z += dt;
    if (Keyboard.keyDown(Keys.S)) cam.position.z -= dt;
    if (Keyboard.keyDown(Keys.A)) cam.position.x -= dt;
    if (Keyboard.keyDown(Keys.D)) cam.position.x += dt;
    if (Keyboard.keyDown(Keys.Q)) cam.position.y -= dt;
    if (Keyboard.keyDown(Keys.E)) cam.position.y += dt;

    if (Keyboard.keyPressed(Keys.PageUp)) {
        selected++;
        await onSelelectJoint();
    }

    if (Keyboard.keyPressed(Keys.PageDown)) {
        selected--;
        await onSelelectJoint();
    }

    if (Keyboard.keyPressed(Keys.M)) {
        await initModels();
    }

    if (Keyboard.keyPressed(Keys.R)) {
        onReset();
    }

    if (Keyboard.keyPressed(Keys.I)) {
        console.clear();
        console.log(modelGltf);
    }

    if (Keyboard.keyPressed(Keys.T)) {
        toggle++;

        if (toggle == 3) {
            toggle = 0;
        }

        console.clear();
        console.log("[TOGGLE]");

        if (toggle == 0) {
            console.log("Everything visible");
        }

        if (toggle == 1) {
            console.log("Only joints visible");
        }

        if (toggle == 2) {
            console.log("Only model visible");
        }
    }

    if (Keyboard.keyPressed(Keys.P)) {
        const root = modelGltf.joints.find(x => x.parent == null);
        const parent = Matrix4.identity();
        const poses = Renderer.getJointTransforms(modelGltf, 0, root.index, animation, time, parent);

        console.log(poses);
    }

    if (Keyboard.keyPressed(Keys.Space)) {
        paused = !paused;
    }

    if (Cursor.isButtonDown(0)) {
        if (Cursor.moveX > 0) rot.y -= dt * 4;
        if (Cursor.moveX < 0) rot.y += dt * 4;
        if (Cursor.moveY > 0) rot.x -= dt * 4;
        if (Cursor.moveY < 0) rot.x += dt * 4;
    }

    if (Cursor.wheelY > 0) {
        cam.position.z -= dt * 2;
    }

    if (Cursor.wheelY < 0) {
        cam.position.z += dt * 2;
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
    Renderer.drawModel(modelGltf, cam, lights, pos, rot, scale, animation, time);
}

async function renderJoints() {
    const skin = modelGltf.skins[0];
    const root = modelGltf.joints.find(x => x.parent == null);
    const transforms = Renderer.getJointTransforms(modelGltf, root.index, animation, time, Matrix4.identity());

    for (let i = 0; i < skin.joints.length; i++) {
        const matTransform = transforms.get(skin.joints[i]);

        let matWorld = Matrix4.identity();
        matWorld = Matrix4.scale(matWorld, scale.x, scale.y, scale.z);
        matWorld = Matrix4.rotate(matWorld, rot.x, rot.y, rot.z);
        matWorld = Matrix4.translate(matWorld, pos.x, pos.y, pos.z);

        let mat = Matrix4.identity();
        mat = Matrix4.multiply(mat, matWorld);
        mat = Matrix4.multiply(mat, matTransform);

        let jointTranslation = Matrix4.extractTranslation(mat);
        let jointRotation = Matrix4.extractRotation(mat);
        let jointScale = Matrix4.extractScale(mat);

        if (selected == skin.joints[i]) {
            Renderer.drawModel(modelJoint, cam, [], jointTranslation, jointRotation, jointScale);
        } else {
            Renderer.drawModel(modelJoint, cam, lights, jointTranslation, jointRotation, jointScale);
        }
    }
}

/* CALLBACKS */
async function onReset() {
    rot.x = 0;
    rot.y = 0;
    pos.x = 0;
    pos.y = 0;
    selected = -1;
    cam.position.z = -4;

    console.clear();
    console.log("Reset");
}

async function onSelelectJoint() {
    if (modelGltf.joints.length == 0) {
        return;
    }

    if (selected >= modelGltf.joints.length) {
        selected = 0;
    }

    if (selected < 0) {
        selected = modelGltf.joints.length - 1;
    }

    const joint = modelGltf.joints.find(x => x.index == selected);

    if (joint == null) {
        console.log(`No joint found with index ${selected}`);
    } else {
        const root = modelGltf.joints.find(x => x.parent == null);
        const transforms = Renderer.getJointTransforms(modelGltf, root.index, animation, time, Matrix4.identity());
        const transform = transforms.get(selected);

        const translation = Matrix4.extractTranslation(transform);
        const rotation = Matrix4.extractRotation(transform);
        const scale = Matrix4.extractScale(transform);

        console.clear();
        console.log(`[JOINT ${joint.index}]`);
        console.log(`Name: ${joint.name}`);
        console.log('');
        console.log(`Translation: ${translation.x} ${translation.y} ${translation.z}`);
        console.log(`Rotation: ${rotation.x} ${rotation.y} ${rotation.z}`);
        console.log(`Scale: ${scale.x} ${scale.y} ${scale.z}`);
    }
}