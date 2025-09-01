import { Texture } from "../graphics";

export class TextureLoader {
    load(path: string): Promise<Texture>;
}