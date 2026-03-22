import { Aquanore } from "../../aquanore/aquanore";
import { Model, PerspectiveCamera, Renderer, Scene } from "../../aquanore/graphics";
import { Shader } from "../../aquanore/graphics/shaders";
import { Vector3 } from "../../aquanore/math";

/* STATE */
let shader: Shader | null = null;
let model: Model | null = null;

let pos: Vector3 = new Vector3(0, 0, 0);
let rot: Vector3 = new Vector3(0, 0, 0);
let scale: Vector3 = new Vector3(1, 1, 1);

/* PROCESS */
await Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    const vSource = await load(`/shader_v.glsl`);
    const fSource = await load(`/shader_f.glsl`);

    shader = new Shader(vSource, fSource);
    model = Model.sphere();

    Scene.camera.translation.z = -4;
}

async function onUpdate(dt: number) {
    
}

async function onRender2D() {

}

async function onRender3D() {
    if (!model || !shader) {
        return;
    }

    Renderer.shaderModel = shader;
    Renderer.drawModel(model, pos, rot, scale);
}

async function onResize() {

}

/* HELPER FUNCTIONS */
async function load(path: string) {
    const res = await fetch(path);

    if (res.status == 200) {
        const raw = await res.text();
        return raw;
    }

    throw new Error(`Failed to fetch shader file from path '${path}'`);
}