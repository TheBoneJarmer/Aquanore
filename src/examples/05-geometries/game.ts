import { Aquanore } from "../../aquanore/aquanore";
import { Keys, Shading } from "../../aquanore/enums";
import { Color, Mesh, Primitive, Model, Renderer, Scene } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { Keyboard } from "../../aquanore/input";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { BoxGeometry, CapsuleGeometry, ConeGeometry, CubeGeometry, CylinderGeometry, RingGeometry, SphereGeometry, TorusGeometry, TorusKnotGeometry } from "../../aquanore/graphics/geometries";
import { IGeometry } from "../../aquanore/interfaces";

let model: Model;
let pos: Vector3 = new Vector3(0, 0, 0);
let rot: Vector3 = new Vector3(0, 0, 0);
let scale: Vector3 = new Vector3(1, 1, 1);

let index = 0;
let geometries = ["Cube", "Box", "Sphere", "Capsule", "Cylinder", "Cone", "Torus", "TorusKnot", "Ring"];
let wireframe = false;
let shading = Shading.Normal;

await Aquanore.init();

Aquanore.onLoad = () => {
    Scene.camera.translation.z = -3;
    Scene.camera.translation.y = 2;
    Scene.camera.rotation.x = MathHelper.radians(35);

    updateInfo();
    updateModel();
};

Aquanore.onUpdate = (dt: number) => {
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

    if (Keyboard.keyPressed(Keys.W)) {
        wireframe = !wireframe;
    }

    if (Keyboard.keyPressed(Keys.Numpad1)) {
        index = 0;

        updateInfo();
        updateModel();
    }
    
    if (Keyboard.keyPressed(Keys.Numpad2)) {
        index = 1;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad3)) {
        index = 2;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad4)) {
        index = 3;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad5)) {
        index = 4;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad6)) {
        index = 5;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad7)) {
        index = 6;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad8)) {
        index = 7;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.Numpad9)) {
        index = 8;
        
        updateInfo();
        updateModel();
    }

    if (Keyboard.keyPressed(Keys.S)) {
        if (shading == Shading.Normal) {
            shading = Shading.Flat;
        } else {
            shading = Shading.Normal;
        }

        updateInfo();
        updateModel();
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, pos, rot, scale, null, null, wireframe);
};

await Aquanore.run();

window.addEventListener("load", () => {
    const left = document.getElementById("arrow-left");
    const right = document.getElementById("arrow-right");

    left!.onclick = () => {
        if (index == 0) {
            return;
        }

        index--;
        updateInfo();
        updateModel();
    }

    right!.onclick = () => {
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
    mat.shading = shading;

    let geom: IGeometry | null = null;

    if (index == 0) geom = new CubeGeometry();
    if (index == 1) geom = new BoxGeometry(2, 1, 1);
    if (index == 2) geom = new SphereGeometry();
    if (index == 3) geom = new CapsuleGeometry();
    if (index == 4) geom = new CylinderGeometry(1, 1, 2, 32, 1, false);
    if (index == 5) geom = new ConeGeometry();
    if (index == 6) geom = new TorusGeometry();
    if (index == 7) geom = new TorusKnotGeometry();
    if (index == 8) geom = new RingGeometry();

    if (geom != null) {
        const pri = new Primitive(geom, mat);
        pri.castShadow = false;
        pri.receiveShadow = false;

        const mesh = new Mesh();
        mesh.primitives.push(pri);

        model = new Model();
        model.meshes.push(mesh);
    }
}