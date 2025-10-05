import { Aquanore } from "../../aquanore/aquanore";

await Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* CALLBACKS */
async function onLoad() {

}

async function onUpdate(dt: number) {

}

async function onRender2D() {

}

async function onRender3D() {

}

async function onResize() {

}