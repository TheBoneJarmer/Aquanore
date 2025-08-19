import { Aquanore } from "../../aquanore/aquanore";
import { Camera } from "../../aquanore/camera";
import { Cursor } from "../../aquanore/cursor";
import { Keys, LightType } from "../../aquanore/enums";
import { Keyboard } from "../../aquanore/keyboard";
import { Light } from "../../aquanore/light";
import { Model } from "../../aquanore/model";
import { Renderer } from "../../aquanore/renderer";
import { Texture } from "../../aquanore/texture";
import { Vector3 } from "../../aquanore/vector3";

let model: Model = null;
let cam: Camera = null;

let pos: Vector3 = null;
let rot: Vector3 = null;
let scale: Vector3 = null;

let lights: Light[] = [];

Aquanore.init();

Aquanore.onLoad = () => {
    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000.0);
    pos = new Vector3();
    rot = new Vector3();
    scale = new Vector3(1, 1, 1);

    model = Model.cube(1);
    model.meshes[0].material.diffuseMap = new Texture("./rock.png");
    //model.meshes[0].calculateNormals();

    lights[0] = new Light(LightType.DIRECTIONAL);
};

Aquanore.onUpdate = (dt: number) => {
    const speed = dt * 0.05;

    cam.position.z = -5;
    cam.aspect = innerWidth / innerHeight;

    if (Keyboard.keyDown(Keys.A)) rot.y -= speed;
    if (Keyboard.keyDown(Keys.D)) rot.y += speed;
    if (Keyboard.keyDown(Keys.W)) rot.x -= speed;
    if (Keyboard.keyDown(Keys.S)) rot.x += speed;

    if (Keyboard.keyPressed(Keys.R)) {
        rot.x = 0;
        rot.y = 0;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};

Aquanore.run();
