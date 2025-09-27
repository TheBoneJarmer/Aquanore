import { Aquanore } from "../../aquanore/aquanore";
import { Texture } from "../../aquanore/graphics";

let tex: Texture;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    const cnv = document.createElement("canvas");
    cnv.width = 512;
    cnv.height = 512;
    cnv.style.position = "absolute";
    cnv.style.left = "0px";
    cnv.style.top = "0px";
    cnv.style.zIndex = "100";

    document.body.appendChild(cnv);

    const ctx = cnv.getContext("2d")!;
    ctx.font = "32px arial"
    ctx.fillStyle = "white";
    ctx.fillText("Hello, World!", 32, 32);
}

async function onUpdate(dt: number) {

}

async function onRender2D() {
    
}

async function onRender3D() {

}

async function onResize() {

}