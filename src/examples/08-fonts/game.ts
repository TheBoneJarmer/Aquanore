import { Aquanore } from "../../aquanore/aquanore";
import { Color, Font, Polygon, Renderer } from "../../aquanore/graphics";
import { Vector2 } from "../../aquanore/math";

let font: Font;

Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;
Aquanore.run();

/* CALLBACKS */
async function onLoad() {
    font = new Font(32, "arial");
}

async function onUpdate(dt: number) {

}

async function onRender2D() {
    const pos = new Vector2(32, 32);
    const scale = new Vector2(1, 1);
    const color = new Color(255, 255, 255);

    Renderer.drawText(font, "Hello, World!", pos, scale, color);
}

async function onRender3D() {

}

async function onResize() {

}

/* INIT */
// async function initShader() {
//     let fSource = "";
//     let vSource = "";

//     const resf = await fetch("font_f.glsl");
//     const resv = await fetch("font_v.glsl");

//     if (resf.ok) {
//         fSource = await resf.text();
//     }

//     if (resf.ok) {
//         vSource = await resv.text();
//     }

//     shader = new Shader(vSource, fSource);
// }

// async function initFont() {
//     const chars = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|"'@#$^&{}[] `;
//     const fontSize = 32;
//     const fontFamily = "arial";

//     const cnv = document.createElement("canvas");
//     cnv.width = 128;
//     cnv.height = 128;

//     const ctx = cnv.getContext("2d", { willReadFrequently: true })!;
//     ctx.font = `${fontSize}px ${fontFamily}`;
//     ctx.fillStyle = "white";
//     ctx.textAlign = "left";
//     ctx.textBaseline = "top";

//     for (let i = 0; i < chars.length; i++) {
//         const char = chars[i];
//         const code = char.charCodeAt(0);
//         const metrics = ctx.measureText(char);

//         const width = metrics.width;
//         const height = fontSize;
//         const baseline = fontSize + metrics.ideographicBaseline;

//         ctx.clearRect(0, 0, 128, 128);
//         ctx.fillText(char, 0, 0);

//         const data = ctx.getImageData(0, 0, width, height);
//         const glyph = {
//             char: char,
//             code: code,
//             advance: width,
//             baseline: baseline,

//             poly: Polygon.rectangle(width, height),
//             tex: new Texture(width, height, data)
//         };

//         glyphs.push(glyph);
//     }

//     console.log(glyphs);
// }

// async function renderText(x: number, y: number, text: string) {
//     let advance = 0;

//     const scale = new Vector2(1, 1);
//     const origin = new Vector2(0, 0);
//     const color = new Color(255, 255, 255);

//     for (let i = 0; i < text.length; i++) {
//         const char = text[i];
//         const glyph = glyphs.find(x => x.char == char);

//         if (glyph != null) {
//             const pos = new Vector2(x + advance, y);
//             const offset = new Vector2(0, 0);

//             Renderer.shaderPolygon = shader;
//             Renderer.drawPolygon(glyph.poly, pos, scale, origin, 0, color, glyph.tex, offset);

//             advance += glyph.advance;
//         }
//     }
// }