import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Renderer } from "../../aquanore/graphics";
import { StandardMaterial } from "../../aquanore/graphics/materials";
import { MathHelper, Vector3 } from "../../aquanore/math";

let model: Model;
let cam: Camera;
let lights: Light[];

let pos: Vector3;
let rot: Vector3;
let scale: Vector3;

Aquanore.init();

Aquanore.onLoad = () => {
    const mat = new StandardMaterial();
    mat.color = new Color(35, 200, 35);

    model = Model.box();
    model = Model.sphere();
    model.meshes[0].material = mat;

    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000);
    cam.position.z = -3;
    cam.position.y = -2;
    cam.rotation.x = MathHelper.radians(35);

    lights = [];
    lights[0] = new Light(LightType.DIRECTIONAL);

    pos = new Vector3(0, 0, 0);
    rot = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);
};

Aquanore.onUpdate = (dt: number) => {
    cam.aspect = innerWidth / innerHeight;

    rot.y += dt;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(model, cam, lights, pos, rot, scale);
};
