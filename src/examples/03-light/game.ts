import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Texture, Renderer } from "../../aquanore/graphics";
import { BasicMaterial, StandardMaterial } from "../../aquanore/graphics/materials";
import { MathHelper, Vector3 } from "../../aquanore/math";

let modelRock: Model = null;
let modelLight: Model = null;
let cam: Camera = null;

let lights: Light[] = [];

let angle: number = 0;

Aquanore.init();

Aquanore.onLoad = () => {
    const matRock = new StandardMaterial();
    matRock.map = new Texture("./rock.png");

    const matLight = new BasicMaterial();
    matLight.color = new Color(255, 255, 255);

    modelRock = Model.torusKnot();
    modelRock.meshes[0].material = matRock;

    modelLight = Model.sphere(0.1);
    modelLight.meshes[0].material = matLight;

    lights[0] = new Light(LightType.POINT);
    lights[0].source = new Vector3(0, 0, 0);

    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000.0);
};

Aquanore.onUpdate = (dt: number) => {
    cam.position.z = -5;
    cam.aspect = innerWidth / innerHeight;
    angle++;

    lights[0].source.x += Math.cos(MathHelper.radians(angle)) * dt;
    lights[0].source.z += Math.sin(MathHelper.radians(angle)) * dt;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    const pos = new Vector3();
    const rot = new Vector3();
    const scale = new Vector3(1, 1, 1);

    Renderer.drawModel(modelRock, cam, lights, pos, rot, scale);
    Renderer.drawModel(modelLight, cam, lights, lights[0].source, Vector3.ZERO, Vector3.ONE);
};
