import { Aquanore } from "../../aquanore/aquanore";
import { Color, Font, Polygon, Renderer } from "../../aquanore/graphics";
import { Vector2 } from "../../aquanore/math";
import { FontLoader } from "../../aquanore/loaders";

let font: Font;

await Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    const loader = new FontLoader();
    font = await loader.load(32, "Alagard", "alagard.ttf");
    
    // We can also just use built-in fonts but I am a Castlevania fan so I like this one better :)
    // In that regard it is important to note that the `family` parameter of the font's constructor works the same as the CSS `font-family` property.
    // font = new Font(32, "Tahoma");
    // font = new Font(32, "Arial, serif");
}

async function onUpdate(dt: number) {

}

async function onRender2D() {
    const text = "<~(0)~> Hèllö, Wórld! <~(0)~>";
    const textLength = font.measureText(text);

    drawText(`TEXT: ${text}`, 32, 32);
    drawText(`LENGTH: ${textLength}`, 32, 80);
}

async function onRender3D() {

}

async function onResize() {

}

// Just to make it a little easier for ourselves
function drawText(text: string, x: number, y: number) {
    const pos = new Vector2(x, y);
    const scale = new Vector2(1, 1);
    const color = new Color(255, 255, 255);

    Renderer.drawText(font, text, pos, scale, color);
}