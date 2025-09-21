import { Sprite } from "../graphics";
import { TextureLoader } from "./texture-loader";

export class SpriteLoader {
    async load(path: string, frameWidth: number, frameHeight: number): Promise<Sprite> {
        const texLoader = new TextureLoader();
        const tex = await texLoader.load(path);

        return new Sprite(tex, frameWidth, frameHeight);
    }
}