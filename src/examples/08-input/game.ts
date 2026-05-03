import { Aquanore } from "../../aquanore/aquanore";
import { Keys } from "../../aquanore/enums";
import { Color, Font, Polygon, Renderer } from "../../aquanore/graphics";
import { Joystick, Keyboard } from "../../aquanore/input";
import { Vector2 } from "../../aquanore/math";

type Platform = {
    x: number;
    y: number;
    scale: number;
    state: number;
    dir: number;
    speed: number;
}

type Player = {
    x: number,
    y: number,
    velX: number,
    velY: number
}

/* ASSETS */
let poly: Polygon;
let font: Font;

/* STATE */
const player: Player = {
    x: 0,
    y: 0,
    velX: 0,
    velY: 0
}

let platforms: Platform[] = [];
let width = 48;
let height = 48;
let scroll = 0;
let score = 0;
let level = 1;

/* RUN */
await Aquanore.init();
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;
Aquanore.onResize = onResize;

await Aquanore.run();

/* FUNCTIONS */
async function initAssets() {
    poly = Polygon.rectangle(width, height);
    font = new Font(24, "Arial");
}

async function initPlayer(canvas: HTMLCanvasElement) {
    player.x = canvas.width / 2 - width / 2;
    player.y = canvas.height - height;
    player.velX = 0;
    player.velY = 0;
}

async function generatePlatforms(canvas: HTMLCanvasElement) {
    const offset = -height * 4;
    const total = 10;
    const begin = platforms.length;
    const end = platforms.length + total;

    for (let i = begin; i < end; i++) {
        const scale = 10 - Math.floor(level / 10);

        let x = Math.random() * (canvas.width - width * scale);
        x = Math.round(x / 32) * 32;

        let y = canvas.height + offset;
        y -= i * height * 8;

        const p: Platform = {
            x: x,
            y: y,
            scale: scale,
            state: 0,
            dir: Math.round(Math.random()),
            speed: 1 + level
        };

        platforms.push(p);
    }
}

async function updateKeyboard(friction: number) {
    if (Joystick.isConnected(0) === true) {
        return;
    }

    if (Keyboard.keyDown(Keys.Left)) {
        player.velX -= friction;
    } else if (Keyboard.keyDown(Keys.Right)) {
        player.velX += friction;
    } else if (player.velX > friction) {
        player.velX -= friction;
    } else if (player.velX < -friction) {
        player.velX += friction;
    } else {
        player.velX = 0;
    }

    if (Keyboard.keyPressed(Keys.Space)) {
        if (player.velY === 0) {
            player.velY = friction * 35;
        }
    }
}

async function updateJoystick(friction: number) {
    if (Joystick.isConnected(0) === false) {
        return;
    }

    const hor = Joystick.getAxis(0, 0) * friction;
    const buttons = Joystick.getButtons(0);

    if (hor !== 0) {
        player.velX += hor;
    } else if (player.velX > friction) {
        player.velX -= friction;
    } else if (player.velX < -friction) {
        player.velX += friction;
    } else {
        player.velX = 0;
    }

    if (buttons[0] === true) {
        if (player.velY === 0) {
            player.velY = friction * 35;
        }
    }
}

async function updateWorld(speed: number, friction: number) {
    const canvas = Aquanore.canvas;

    // Update level
    if (platforms[platforms.length - 1].state === 1) {
        level++;

        await generatePlatforms(canvas);
    }

    // Update score
    if (player.velY > 0) {
        score++;
    }

    if (platforms.some(x => x.state === 1)) {
        score--;
    }

    // Update physics and platforms
    player.velY -= friction;

    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];

        if (p.dir === 0) {
            p.x += friction * p.speed;
        } else {
            p.x -= friction * p.speed;
        }

        if (p.x + p.scale * width > canvas.width) {
            p.dir = 1;
        }

        if (p.x < 0) {
            p.dir = 0;
        }
    }

    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];

        if (p.state === 2) {
            continue;
        }

        if (player.x + width < p.x || player.x > p.x + p.scale * width) {
            p.state = 0;
            continue;
        }

        if (player.y + height < p.y || player.y + height > p.y + height) {
            p.state = 0;
            continue;
        }

        if (player.velY > 0) {
            if (p.state === 1) {
                p.state = 2;
            }

            continue;
        }

        p.state = 1;
        player.velY = 0;
        player.y = p.y - height;
    }

    // Update pos
    player.x += player.velX;
    player.y -= player.velY;

    if (player.velX > speed) player.velX = speed;
    if (player.velX < -speed) player.velX = -speed;

    if (player.x < 0) {
        player.x = 0;
        player.velX = 0;
    }

    if (player.x > canvas.width - width) {
        player.x = canvas.width - width;
        player.velX = 0;
    }

    if (player.y + height > canvas.height) {
        player.y = canvas.height - height;
        player.velY = 0;

        if (platforms.some(x => x.state === 2)) {
            score = 0;
            level = 1;
            platforms = [];

            await initPlayer(canvas);
            await generatePlatforms(canvas);
        }
    }

    if (player.y < canvas.height / 2) {
        scroll = canvas.height / 2 - player.y;
    } else {
        scroll = 0;
    }
}

async function renderPlatforms() {
    for (let p of platforms) {
        const pos = new Vector2(p.x, p.y + scroll);
        const scale = new Vector2(p.scale, 1);
        const origin = new Vector2(0, 0);
        const color = new Color(35, 100, 35);

        if (p.state === 1) {
            color.r = 100;
            color.b = 35;
            color.g = 35;
        }

        if (p.state === 2) {
            color.r = 35;
            color.g = 35;
            color.b = 100;
        }

        Renderer.drawPolygon(poly, pos, scale, origin, 0, color);
    }
}

async function renderPlayer() {
    const pos = new Vector2(player.x, player.y + scroll);
    const scale = new Vector2(1, 1);
    const origin = new Vector2(0, 0);
    const color = new Color(35, 35, 255);

    Renderer.drawPolygon(poly, pos, scale, origin, 0, color);
}

async function renderLevel() {
    const canvas = Aquanore.canvas;
    const text = `Level: ${level}`;
    const textWidth = font.measureText(text);

    const pos = new Vector2(canvas.width - 32 - textWidth, 32);
    const scale = new Vector2(1, 1);
    const color = new Color(255, 255, 255);

    Renderer.drawFont(font, text, pos, scale, color);
}

async function renderScore() {
    const pos = new Vector2(32, 32);
    const scale = new Vector2(1, 1);
    const color = new Color(255, 255, 255);

    Renderer.drawFont(font, `Score: ${score}`, pos, scale, color);
}

/* CALLBACKS */
async function onLoad() {
    const canvas = Aquanore.canvas;

    await initAssets();
    await initPlayer(canvas);
    await generatePlatforms(canvas);
}

async function onUpdate(dt: number) {
    const speed = dt * 500;
    const friction = dt * 50;

    await updateJoystick(friction);
    await updateKeyboard(friction);
    await updateWorld(speed, friction);
}

async function onRender2D() {
    await renderPlatforms();
    await renderPlayer();
    await renderScore();
    await renderLevel();
}

async function onRender3D() {

}

async function onResize() {

}