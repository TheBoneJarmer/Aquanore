import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Texture, Renderer, Mesh, MeshPrimitive } from "../../aquanore/graphics";
import { SphereGeometry, TorusGeometry } from "../../aquanore/graphics/geometries";
import { BasicMaterial, StandardMaterial } from "../../aquanore/graphics/materials";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { TextureLoader } from "../../aquanore/loaders";

let modelRock = null;
let modelLight = null;
let cam = null;
let lights = [];
let angle = 0;

await Aquanore.init();

Aquanore.onLoad = async () => {
    const texLoader = new TextureLoader();

    const matRock = new StandardMaterial();
    matRock.colorMap = await texLoader.load("rock.png");
    matRock.normalMap = await texLoader.load("rock_normal.png");

    const matLight = new BasicMaterial();
    matLight.color = new Color(255, 255, 255);

    const meshRock = new Mesh();
    meshRock.primitives[0] = new MeshPrimitive(new TorusGeometry(), matRock);

    const meshLight = new Mesh();
    meshLight.primitives[0] = new MeshPrimitive(new SphereGeometry(0.1), matLight);

    modelRock = new Model();
    modelRock.data = meshRock;

    modelLight = new Model();
    modelLight.data = meshLight;

    lights[0] = new Light(LightType.POINT);
    lights[0].source = new Vector3(-1, 0, -1);

    cam = new Camera(60, innerWidth / innerHeight, 0.01, 1000.0);
};

Aquanore.onUpdate = (dt) => {
    cam.position.z = -5;
    cam.aspect = innerWidth / innerHeight;

    angle++;

    lights[0].source.x += Math.cos(MathHelper.radians(angle)) * dt * 2;
    lights[0].source.z += Math.sin(MathHelper.radians(angle)) * dt * 2;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    const pos = new Vector3();
    const rot = new Vector3(0, MathHelper.radians(angle / 5), 0);
    const scale = new Vector3(1, 1, 1);

    Renderer.drawModel(modelRock, cam, lights, pos, rot, scale);
    Renderer.drawModel(modelLight, cam, lights, lights[0].source, Vector3.ZERO, Vector3.ONE);
};

await Aquanore.run();