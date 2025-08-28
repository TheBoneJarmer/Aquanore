import { Aquanore } from "../../aquanore/aquanore";
import { Keys, LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Texture, Renderer } from "../../aquanore/graphics";
import { Keyboard } from "../../aquanore/input";
import { BasicMaterial, StandardMaterial } from "../../aquanore/graphics/materials";
import { Vector3 } from "../../aquanore/math";

let modelRock: Model = null;
let modelLight: Model = null;
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

    const matRock = new StandardMaterial();
    matRock.map = new Texture("./rock.png");

    const matLight = new BasicMaterial();
    matLight.color = new Color(255, 255, 255);

    modelRock = Model.cube(1);
    modelRock.meshes[0].material = matRock;

    modelLight = Model.cube(0.1);
    modelLight.meshes[0].material = matLight;

    lights[0] = new Light(LightType.POINT);
    lights[0].source = new Vector3(0, 0, 0);
};

Aquanore.onUpdate = (dt: number) => {
    const rotSpeed = dt * 0.05;
    const moveSpeed = dt;

    cam.position.z = -5;
    cam.aspect = innerWidth / innerHeight;

    if (Keyboard.keyDown(Keys.A)) rot.y -= rotSpeed;
    if (Keyboard.keyDown(Keys.D)) rot.y += rotSpeed;
    if (Keyboard.keyDown(Keys.W)) rot.x -= rotSpeed;
    if (Keyboard.keyDown(Keys.S)) rot.x += rotSpeed;

    if (Keyboard.keyDown(Keys.Up)) lights[0].source.z -= moveSpeed;
    if (Keyboard.keyDown(Keys.Down)) lights[0].source.z += moveSpeed;
    if (Keyboard.keyDown(Keys.Left)) lights[0].source.x -= moveSpeed;
    if (Keyboard.keyDown(Keys.Right)) lights[0].source.x += moveSpeed;

    if (Keyboard.keyPressed(Keys.R)) {
        rot.x = 0;
        rot.y = 0;

        lights[0].source.x = 0;
        lights[0].source.z = 0;
    }
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    Renderer.drawModel(modelRock, cam, lights, pos, rot, scale);
    Renderer.drawModel(modelLight, cam, lights, lights[0].source, Vector3.ZERO, Vector3.ONE);
};
