import { Aquanore } from "../../aquanore/aquanore";
import { Audio, Sound, SoundInstance } from "../../aquanore/audio";
import { Keys } from "../../aquanore/enums";
import { Color, Sprite,Renderer } from "../../aquanore/graphics";
import { Cursor, Keyboard } from "../../aquanore/input";
import { Vector2 } from "../../aquanore/math";

let voice: Sound;
let ambient: Sound;
let handle: SoundInstance;
let sprite: Sprite;

Aquanore.init();

Aquanore.onLoad = async () => {
    sprite = new Sprite("pahrak.png", 1280, 1024);
    voice = new Sound("voice.mp3");
    ambient = new Sound("ambient.mp3");
};

Aquanore.onUpdate = async (dt: number) => {
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

Aquanore.run();
