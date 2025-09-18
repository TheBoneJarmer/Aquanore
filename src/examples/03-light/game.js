import { Aquanore } from "../../aquanore/aquanore";
import { LightType } from "../../aquanore/enums";
import { Camera, Color, Light, Model, Renderer, Mesh, Primitive, Scene } from "../../aquanore/graphics";
import { SphereGeometry, TorusGeometry } from "../../aquanore/graphics/geometries";
import { BasicMaterial, StandardMaterial } from "../../aquanore/graphics/materials";
import { MathHelper, Vector3 } from "../../aquanore/math";
import { TextureLoader } from "../../aquanore/loaders";
import { AquanoreOptions } from "../../aquanore/aquanore-options";

let modelRock = null;
let modelLight = null;
let angle = 0;

const options = new AquanoreOptions();
options.graphics.shadow.enabled = false;

Aquanore.init(options);

Aquanore.onLoad = async () => {
    const texLoader = new TextureLoader();

    const matRock = new StandardMaterial();
    matRock.colorMap = await texLoader.load("rock.png");
    matRock.normalMap = await texLoader.load("rock_normal.png");

    const matLight = new BasicMaterial();
    matLight.color = new Color(255, 255, 255);

    const meshRock = new Mesh();
    meshRock.primitives[0] = new Primitive(new TorusGeometry(), matRock);

    const meshLight = new Mesh();
    meshLight.primitives[0] = new Primitive(new SphereGeometry(0.1), matLight);

    modelRock = new Model();
    modelRock.meshes.push(meshRock);

    modelLight = new Model();
    modelLight.meshes.push(meshLight);

    Scene.camera.position.z = -5;
    Scene.lights[0] = new Light(LightType.Point);
    Scene.lights[0].source = new Vector3(-1, 0, -1);
};

Aquanore.onUpdate = (dt) => {
    angle++;

    Scene.lights[0].source.x += Math.cos(MathHelper.radians(angle)) * dt * 2;
    Scene.lights[0].source.z += Math.sin(MathHelper.radians(angle)) * dt * 2;
};

Aquanore.onRender2D = () => {

};

Aquanore.onRender3D = () => {
    const pos = new Vector3();
    const rot = new Vector3(0, MathHelper.radians(angle / 5), 0);
    const scale = new Vector3(1, 1, 1);

    Renderer.drawModel(modelRock, pos, rot, scale);
    Renderer.drawModel(modelLight, Scene.lights[0].source, Vector3.ZERO, Vector3.ONE);
};

await Aquanore.run();