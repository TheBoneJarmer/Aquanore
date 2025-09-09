import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Mesh, Primitive, Model, Renderer } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { BoxGeometry, CapsuleGeometry, ConeGeometry, CubeGeometry, CylinderGeometry, RingGeometry, SphereGeometry, TorusGeometry, TorusKnotGeometry } from "../../aquanore/graphics/geometries";

let model = null;
let cam = null;
let lights = [];
let pos = new Vector3(0, 0, 0);
let rot = new Vector3(0, 0, 0);
let scale = new Vector3(1, 1, 1);

let index = 0;
let geometries = ["Cube", "Box", "Sphere", "Capsule", "Cylinder", "Cone", "Torus", "TorusKnot", "Ring"];

Aquanore.init();

Aquanore.onLoad = () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -2;
    cam.rotation.x = MathHelper.radians(35);

    lights[0] = new Light(LightType.Directional);

    updateInfo();
    updateModel();
};

Aquanore.onUpdate = (dt) => {
    cam.aspect = innerWidth / innerHeight;
    rot.y += dt;
    // rot.x += dt;
    // rot.z += dt;

    if (Keyboard.keyPressed(Keys.Left) && index > 0) {
        index--;

        updateModel();
        updateInfo();
    }

    if (Keyboard.keyPressed(Keys.Right) && index < geometries.length - 1) {
        index++;

        updateModel();
        updateInfo();
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

Aquanore.run();

window.addEventListener("load", () => {
    const left = document.getElementById("arrow-left");
    const right = document.getElementById("arrow-right");

    left.onclick = () => {
        if (index == 0) {
            return;
        }

        index--;
        updateInfo();
        updateModel();
    }

    right.onclick = () => {
        if (index == geometries.length - 1) {
            return;
        }

        index++;
        updateInfo();
        updateModel();
    }
});

function updateInfo() {
    const left = document.getElementById("arrow-left");
    const right = document.getElementById("arrow-right");
    const title = document.getElementById("title");

    if (!left || !right || !title) {
        return;
    }

    left.className = index > 0 ? "arrow" : "arrow disabled";
    right.className = index < geometries.length - 1 ? "arrow" : "arrow disabled";
    title.innerHTML = geometries[index];
}

function updateModel() {
    let mat = new StandardMaterial();
    mat.color = new Color(35, 200, 35);

    let geom = null;

    if (index == 0) geom = new CubeGeometry();
    if (index == 1) geom = new BoxGeometry(2, 1, 1);
    if (index == 2) geom = new SphereGeometry();
    if (index == 3) geom = new CapsuleGeometry();
    if (index == 4) geom = new CylinderGeometry(1, 1, 2, 32, 1, false);
    if (index == 5) geom = new ConeGeometry();
    if (index == 6) geom = new TorusGeometry();
    if (index == 7) geom = new TorusKnotGeometry();
    if (index == 8) geom = new RingGeometry();

    const pri = new Primitive(geom, mat);
    const mesh = new Mesh();
    mesh.primitives.push(pri);

    model = new Model();
    model.meshes.push(mesh);
}