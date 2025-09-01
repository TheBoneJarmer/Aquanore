import { Aquanore } from "../../aquanore/aquanore";
import { Audio, Sound } from "../../aquanore/audio";
import { Keys } from "../../aquanore/enums";
import { Color, Sprite,Renderer } from "../../aquanore/graphics";
import { Cursor, Keyboard } from "../../aquanore/input";
import { Vector2 } from "../../aquanore/math";
import { TextureLoader } from "../../aquanore/loaders";

let voice = null;
let ambient = null;
let handle = null;
let sprite = null;

Aquanore.init();

Aquanore.onLoad = async () => {
    const loader = new TextureLoader();
    const tex = await loader.load("pahrak.png");

    sprite = new Sprite(tex, 1280, 1024);
    voice = new Sound("voice.mp3");
    ambient = new Sound("ambient.mp3");
};

Aquanore.onUpdate = async (dt) => {
    if (Cursor.isButtonPressed(0) && handle == null) {
        const x = innerWidth / 2 - sprite.width / 2;
        const y = innerHeight / 2 - sprite.height / 2;

        if (Cursor.x >= x && Cursor.y >= y && Cursor.x < x + sprite.width && Cursor.y < y + sprite.height) {
            handle = await Audio.play(ambient);
            handle.loop = true;

            setTimeout(async () => {
                await Audio.play(voice);
            }, 2000);
        }
    }

    if (handle != null) {
        if (Keyboard.keyPressed(Keys.Up)) {
            handle.volume += 0.1;
            console.log(handle.volume);
        }

        if (Keyboard.keyPressed(Keys.Down)) {
            handle.volume -= 0.1;
            console.log(handle.volume);
        }
    }
};

Aquanore.onRender2D = () => {
    const x = innerWidth / 2 - sprite.width / 2;
    const y = innerHeight / 2 - sprite.height / 2;

    Renderer.drawSprite(sprite, new Vector2(x, y), new Vector2(1, 1), new Vector2(0, 0), 0, 0, 0, false, false, new Color(255, 255, 255, 255));
};
