import { Aquanore, AquanoreOptions } from "../../aquanore/aquanore";
import { Color } from "../../aquanore/color";
import { Polygon } from "../../aquanore/polygon";
import { Renderer } from "../../aquanore/renderer";
import { Vector2 } from "../../aquanore/vector2";

let poly: Polygon | null = null;
let angle: number = 0;

Aquanore.init();

Aquanore.onLoad = () => {
    poly = Polygon.rectangle(64, 64);
};

Aquanore.onUpdate = (dt: number) => {
    angle += dt * 0.1;
};

Aquanore.onRender = () => {
    const pos = new Vector2(innerWidth / 2, innerHeight / 2);
    const scale = new Vector2(1, 1);
    const origin = new Vector2(32, 32);
    const offset = new Vector2(0, 0);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawPolygon(poly!, pos, scale, origin, angle, color);
};

Aquanore.run();
