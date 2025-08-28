import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Renderer } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";

let model: Model = null;
let cam: Camera = null;
let lights: Light[] = [];
let pos: Vector3 = new Vector3(0, 0, 0);
let rot: Vector3 = new Vector3(0, 0, 0);
let scale: Vector3 = new Vector3(1, 1, 1);
let shape: number = 0;
let shapes: string[] = ["Cube", "Box", "Sphere", "Capsule", "Cylinder", "Cone", "Torus", "TorusKnot", "Ring"];

Aquanore.init();

Aquanore.onLoad = () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -2;
    cam.rotation.x = MathHelper.radians(35);

    lights[0] = new Light(LightType.DIRECTIONAL);

    updateModel();
};

Aquanore.onUpdate = (dt: number) => {
    cam.aspect = innerWidth / innerHeight;
    rot.y += dt;
    // rot.x += dt;
    // rot.z += dt;

    if (Keyboard.keyPressed(Keys.Left) && shape > 0) {
        shape--;
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Right) && shape < shapes.length - 1) {
        shape++;
        updateModel();
    }

    updateInfo();
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

function updateInfo() {
    const el = document.getElementById("info");
    el.innerHTML = "";

    if (shape > 0) {
        el.innerHTML += "<span class='arrow'><</span>";
    } else {
        el.innerHTML += "<span class='arrow disabled'><</span>";
    }

    el.innerHTML += "<span class='title'>";
    el.innerHTML += shapes[shape];
    el.innerHTML += "</span>";

    if (shape < shapes.length - 1) {
        el.innerHTML += "<span class='arrow'>></span>";
    } else {
        el.innerHTML += "<span class='arrow disabled'>></span>";
    }
}

function updateModel() {
    const mat = new StandardMaterial();
    mat.color = new Color(35, 200, 35);

    if (shape == 0) model = Model.cube();
    if (shape == 1) model = Model.box(2, 1, 1);
    if (shape == 2) model = Model.sphere();
    if (shape == 3) model = Model.capsule();
    if (shape == 4) model = Model.cylinder(1, 1, 2, 32, 1, false);
    if (shape == 5) model = Model.cone();
    if (shape == 6) model = Model.torus();
    if (shape == 7) model = Model.torusKnot();
    if (shape == 8) model = Model.ring();

    model.meshes[0].material = mat;
}