import {Jarmer} from "../main/jarmer";
import {Keyboard, Keys} from "../main/keyboard";
import {Polygon} from "../main/polygon";
import {Renderer} from "../main/renderer";
import {Vector2} from "../main/vector2";
import {Color} from "../main/color";

let poly: Polygon = null;
let pos: Vector2 = new Vector2(32, 32);

Jarmer.init();
Jarmer.onLoad = () => {
    const verts = [
        0, 0,
        32, 0,
        0, 32,
        32, 0,
        0, 32,
        32, 32
    ];

    const texcoords = [
        0, 0,
        1, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1
    ];

    poly = new Polygon(verts, texcoords);
};
Jarmer.onUpdate = (dt: number) => {
    if (Keyboard.keyDown(Keys.Up)) {
        pos.y -= dt / 10.0;
    }

    if (Keyboard.keyDown(Keys.Down)) {
        pos.y += dt / 10.0;
    }

    if (Keyboard.keyDown(Keys.Left)) {
        pos.x -= dt / 10.0;
    }

    if (Keyboard.keyDown(Keys.Right)) {
        pos.x += dt / 10.0;
    }
};
Jarmer.onRender = () => {
    const scale = new Vector2(1, 1);
    const origin = new Vector2(0, 0);
    const offset = new Vector2(0, 0);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawPolygon(poly, null, pos, scale, origin, offset, 0, false, false, color);
};
Jarmer.run();