import {Aquanore} from "../main/aquanore";
import {Polygon} from "../main/polygon";
import {Renderer} from "../main/renderer";
import {Vector2} from "../main/vector2";
import {Color} from "../main/color";

let poly: Polygon = null;
let pos: Vector2 = new Vector2(32, 32);
let friction: Vector2 = new Vector2(1, 1);

Aquanore.init();
Aquanore.onLoad = () => {
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
    pos.x = window.innerWidth / 2;
    pos.y = window.innerHeight / 2;
};
Aquanore.onUpdate = (dt: number) => {
    const speed = dt / 10.0;
    //const speed = 4;

    pos.x += friction.x * speed;
    pos.y += friction.y * speed;

    if (pos.x < 0) {
        pos.x = 0;
        friction.x = 1;
    }

    if (pos.y < 0) {
        pos.y = 0;
        friction.y = 1;
    }

    if (pos.x > window.innerWidth - 32) {
        pos.x = window.innerWidth - 32;
        friction.x = -1;
    }

    if (pos.y > window.innerHeight - 32) {
        pos.y = window.innerHeight - 32;
        friction.y = -1;
    }
};
Aquanore.onRender = () => {
    const scale = new Vector2(1, 1);
    const origin = new Vector2(0, 0);
    const offset = new Vector2(0, 0);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawPolygon(poly, null, pos, scale, origin, offset, 0, false, false, color);
};
Aquanore.run();