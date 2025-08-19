import { Aquanore } from "../../aquanore/aquanore";
import { Camera } from "../../aquanore/camera";
import { Cursor } from "../../aquanore/cursor";
import { LightType } from "../../aquanore/enums";
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

    lights[0] = new Light(LightType.DIRECTIONAL);
};

Aquanore.onUpdate = (dt: number) => {
    cam.position.z = -5;
    cam.aspect = innerWidth / innerHeight;

    if (Cursor.isButtonDown(0)) {
        rot.x -= Cursor.moveY * 0.001;
        rot.y -= Cursor.moveX * 0.001;
    }

    if (Cursor.isButtonPressed(2)) {
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
