import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Mesh, Model, Primitive, Renderer } from "../../aquanore/graphics";
import { MathHelper, Vector3, Matrix4 } from "../../aquanore/math";
import { GltfLoader } from "../../aquanore/loaders";
import { Keyboard } from "../../aquanore/input";
import { BasicMaterial } from "../../aquanore/graphics/materials";
import { CubeGeometry } from "../../aquanore/graphics/geometries";

let modelGltf = null;
let modelJoint = null;
let cam = null;
let lights = [];

let pos = new Vector3();
let rot = new Vector3();
let scale = new Vector3(1, 1, 1);
let animation = null;
let animationTime = 0;
let animationPaused = false;

Aquanore.init();
Aquanore.clearColor = new Color(55, 55, 55);

Aquanore.onLoad = async () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -4;
    cam.position.y = -1;

    lights[0] = new Light(LightType.Directional);

    const geomJoint = new CubeGeometry(0.1);
    const matJoint = new BasicMaterial();
    matJoint.color = new Color(255, 0, 0);

    const priJoint = new Primitive(geomJoint, matJoint);

    const meshJoint = new Mesh();
    meshJoint.primitives.push(priJoint);

    modelJoint = new Model();
    modelJoint.meshes.push(meshJoint);

    let loader = new GltfLoader();
    // model = await loader.load("mage.glb");
    // animation = model.animations.find(x => x.name == "Idle");

    modelGltf = await loader.load("debug.gltf");
    modelGltf.meshes.forEach((mesh) => {
        mesh.primitives[0].material = new BasicMaterial();
    });
    animation = modelGltf.animations[0];

    // model = await loader.load("axis.glb");
    // animation = model.animations[0];
    // scale = new Vector3(0.25, 0.25, 0.25);

    console.log(modelGltf);
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;

    if (!animationPaused) {
        animationTime += dt;
    }

    if (animation && animationTime > animation.getDuration()) {
        animationTime = 0;
    }

    if (Keyboard.keyDown(Keys.Up)) {
        rot.x -= dt;
    }

    if (Keyboard.keyDown(Keys.Down)) {
        rot.x += dt;
    }

    if (Keyboard.keyDown(Keys.Left)) {
        rot.y -= dt;
    }

    if (Keyboard.keyDown(Keys.Right)) {
        rot.y += dt;
    }

    if (Keyboard.keyPressed(Keys.R)) {
        rot.x = 0;
        rot.y = 0;
    }

    if (Keyboard.keyPressed(Keys.Space)) {
        animationPaused = !animationPaused;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    const skin = modelGltf.skins[0];

    Renderer.drawModel(modelGltf, cam, lights, pos, rot, scale, animation, animationTime);

    for (let i = 0; i < skin.joints.length; i++) {
        const joint = modelGltf.joints.find(x => x.index == skin.joints[i]);
        const matInverse = skin.matrices[i];
        const matGlobal = Renderer.getGlobalTransform(modelGltf, joint.index, animation, animationTime);

        let matLocal = Matrix4.identity();
        matLocal = Matrix4.translate(matLocal, joint.translation.x, joint.translation.y, joint.translation.z);
        matLocal = Matrix4.rotate(matLocal, joint.rotation.x, joint.rotation.y, joint.rotation.z);
        matLocal = Matrix4.scale(matLocal, joint.scale.x, joint.scale.y, joint.scale.z);

        let matWorld = Matrix4.identity();
        matWorld = Matrix4.scale(matWorld, scale.x, scale.y, scale.z);
        matWorld = Matrix4.rotate(matWorld, rot.x, rot.y, rot.z);
        matWorld = Matrix4.translate(matWorld, pos.x, pos.y, pos.z);

        let mat = Matrix4.identity();
        mat = Matrix4.multiply(mat, matInverse);
        mat = Matrix4.multiply(mat, matLocal);
        mat = Matrix4.multiply(mat, matGlobal);
        //mat = Matrix4.multiply(mat, matWorld);

        const jointTranslation = Matrix4.extractTranslation(mat);
        const jointRotation = Matrix4.extractRotation(mat);
        const jointScale = Matrix4.extractScale(mat);

        Renderer.drawModel(modelJoint, cam, lights, jointTranslation, jointRotation, jointScale);
    }
};

Aquanore.run();