import { Aquanore, AquanoreOptions } from "../../aquanore/aquanore";
import { Color, Polygon, Renderer } from "../../aquanore/graphics";
import { Vector2 } from "../../aquanore/math";

let poly: Polygon;
let angle: number;

Aquanore.init();

Aquanore.onLoad = () => {
    poly = Polygon.rectangle(64, 64);
    angle = 0;
};

Aquanore.onUpdate = (dt: number) => {
    angle += dt * 100;
};

Aquanore.onRender2D = () => {
    const pos = new Vector2(innerWidth / 2, innerHeight / 2);
    const scale = new Vector2(1, 1);
    const origin = new Vector2(32, 32);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawPolygon(poly, pos, scale, origin, angle, color);
};
