import { Texture } from "../graphics";

export class TextureLoader {
    async load(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                const tex = new Texture(img.width, img.height, img);
                resolve(tex);
            };

            img.onerror = (err) => {
                reject(new Error(`Failed to load image ${path}`));
            };
        });
    }
}