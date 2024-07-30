import {Aquanore, Keyboard, Keys} from "../main/index";
import {Renderer} from "../main/renderer";
import {Vector2} from "../main/vector2";
import {Color} from "../main/color";
import {Sprite} from "../main/sprite";

let sprite: Sprite = null;
let pos: Vector2 = new Vector2(64, 64);
let goal = new Vector2(64, 64);
let frame = 0;
let frameTimer = 0;
let direction = 0;
let index = 3;

Aquanore.init();
Aquanore.onLoad = () => {
    sprite = new Sprite("npc.png", 16, 16);
};
Aquanore.onUpdate = (dt: number) => {
    const speed = dt / 10.0;

    if (goal.x == pos.x && goal.y == pos.y) {
        if (Keyboard.keyDown(Keys.Down)) {
            direction = 0;
            goal.y += 64;
        }

        if (Keyboard.keyDown(Keys.Up)) {
            direction = 1;
            goal.y -= 64;
        }

        if (Keyboard.keyDown(Keys.Left)) {
            direction = 3;
            goal.x -= 64;
        }

        if (Keyboard.keyDown(Keys.Right)) {
            direction = 2;
            goal.x += 64;
        }
    } else {
        frameTimer++;

        if (frameTimer === 8) {
            frame++;
            frameTimer = 0;
        }

        if (frame == 4) {
            frame = 0;
        }
    }

    if (pos.x > goal.x + speed) {
        pos.x -= speed;
    } else if (pos.x < goal.x - speed) {
        pos.x += speed;
    } else {
        pos.x = goal.x;
    }

    if (pos.y > goal.y + speed) {
        pos.y -= speed;
    } else if (pos.y < goal.y - speed) {
        pos.y += speed;
    } else {
        pos.y = goal.y;
    }
};
Aquanore.onRender = () => {
    const scale = new Vector2(4, 4);
    const origin = new Vector2(0, 0);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawSprite(sprite, pos, scale, origin, (direction * 4) + frame, index, 0, false, false, color);
};
Aquanore.run();