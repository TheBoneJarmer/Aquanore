import { Aquanore } from "../../aquanore/aquanore";
import { Model, Renderer, Scene } from "../../aquanore/graphics";
import { Shader } from "../../aquanore/graphics/shaders";
import { Cursor } from "../../aquanore/input";
import { Vector3 } from "../../aquanore/math";

/* STATE */
let shader: Shader;
let model: Model;

let pos: Vector3 = new Vector3(0, 0, 0);
let rot: Vector3 = new Vector3(0, 0, 0);
let scale: Vector3 = new Vector3(1, 1, 1);

let time: number = 0;

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
    const fSource = await load(`/shiny_f.glsl`); // https://www.shadertoy.com/view/7cjGRR
    // const fSource = await load(`/liquid_f.glsl`); // https://www.shadertoy.com/view/MtdXzr

    shader = new Shader(vSource, fSource);
    model = Model.cube(2);

    Scene.camera.translation.z = -2;
}

async function onUpdate(dt: number) {
    time += dt;
}

async function onRender2D() {

}

async function onRender3D() {
    // Set our custom shader as the current model shader
    // This resets at the end of the loop to the original model shader
    Renderer.shaderModel = shader;

    // Switch to our shader in order to set uniform variable used by the ShaderToy shaders
    // This is required because WebGL (and OpenGL too) only allow setting uniforms to the current active shader.
    Renderer.switchShader(shader);
    shader.u2f("iResolution", 0.5, 0.5); // Needs to be this low because we are not rendering to our screen directly but to a model
    shader.u1f("iTime", time);
    shader.u4f("iMouse", Cursor.x, Cursor.y, 0, 0);

    // Now draw the model like you would do normally.
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