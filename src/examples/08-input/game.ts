import { Aquanore } from "../../aquanore/aquanore";
import { Keys } from "../../aquanore/enums";
import { Color, Font, Polygon, Renderer } from "../../aquanore/graphics";
import { Joystick, Keyboard } from "../../aquanore/input";
import { Vector2 } from "../../aquanore/math";

type Platform = {
    x: number;
    y: number;
    width: number;
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
let globalWidth = 48;
let globalHeight = 48;
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
    poly = Polygon.rectangle(1, 1);
    font = new Font(24, "Arial");
}

async function initPlayer(canvas: HTMLCanvasElement) {
    player.x = canvas.width / 2 - globalWidth / 2;
    player.y = canvas.height - globalHeight;
    player.velX = 0;
    player.velY = 0;
}

async function generatePlatforms(canvas: HTMLCanvasElement) {
    const offset = -globalHeight * 4;
    const total = 10;
    const begin = platforms.length;
    const end = platforms.length + total;

    for (let i = begin; i < end; i++) {
        let width = canvas.width / 4 - level;

        if (width < globalWidth) {
            width = globalWidth;
        }

        let x = canvas.width / 2 - width / 2;
        let y = canvas.height + offset;
        y -= i * globalHeight * 8;

        const p: Platform = {
            x: x,
            y: y,
            width: width,
            state: 0,
            dir: Math.round(Math.random()),
            speed: level * 1.125
        };

        platforms.push(p);
    }
}

async function updateKeyboard(dt: number) {
    if (Joystick.isConnected(0) === true) {
        return;
    }

    const friction = dt * 10;

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

async function updateJoystick(dt: number) {
    if (Joystick.isConnected(0) === false) {
        return;
    }

    const friction = dt * 1000;
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
            player.velY = friction * 2.5;
        }
    }
}

async function updateLevel(dt: number) {
    const canvas = Aquanore.canvas;

    // Update level
    if (platforms[platforms.length - 1].state === 1) {
        level++;

        await generatePlatforms(canvas);
    }

    if (player.y + globalHeight > canvas.height && platforms.some(x => x.state === 2)) {
        score = 0;
        level = 1;
        platforms = [];

        player.y = canvas.height - globalHeight;
        player.velY = 0;

        await generatePlatforms(canvas);
    }

    // Update score
    if (player.velY > 0) {
        score += level;
    }

    if (platforms.some(x => x.state === 1)) {
        score--;
    }
}

async function updatePlatforms(dt: number) {
    const canvas = Aquanore.canvas;
    const friction = dt * 100;

    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];

        if (p.dir === 0) {
            p.x += friction * p.speed;
        } else {
            p.x -= friction * p.speed;
        }

        if (p.x + p.width > canvas.width) {
            p.dir = 1;
        }

        if (p.x < 0) {
            p.dir = 0;
        }
    }
}

async function updatePhysics(dt: number) {
    const friction = dt * 100;

    // Make the player fall
    player.velY -= friction;

    // Update platform physics
    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];

        if (p.state === 2) {
            continue;
        }

        if (player.x + globalWidth < p.x || player.x > p.x + p.width) {
            p.state = 0;
            continue;
        }

        if (player.y + globalHeight < p.y || player.y + globalHeight > p.y + globalHeight) {
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
        player.y = p.y - globalHeight;
        player.velY = 0;
    }
}

async function updatePlayer(dt: number) {
    const canvas = Aquanore.canvas;
    const speed = dt * 100;

    player.x += player.velX;
    player.y -= player.velY;

    if (player.velX > speed) player.velX = speed;
    if (player.velX < -speed) player.velX = -speed;

    if (player.x < 0) {
        player.x = 0;
        player.velX = 0;
    }

    if (player.x > canvas.width - globalWidth) {
        player.x = canvas.width - globalWidth;
        player.velX = 0;
    }

    if (player.y + globalHeight > canvas.height) {
        player.y = canvas.height - globalHeight;
        player.velY = 0;

        if (platforms.some(x => x.state === 2)) {
            score = 0;
            level = 1;
            platforms = [];

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
        const scale = new Vector2(p.width, globalHeight);
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
    const scale = new Vector2(globalWidth, globalHeight);
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
    await updateJoystick(dt);
    await updateKeyboard(dt);
    await updateLevel(dt);
    await updatePhysics(dt);
    await updatePlatforms(dt);
    await updatePlayer(dt);
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