import { Font } from "../graphics";
import { BitmapFont } from "../graphics/bitmapfont";
import { TextureLoader } from "./texture-loader";

export class FontLoader {
    private _texLoader: TextureLoader;

    constructor() {
        this._texLoader = new TextureLoader();
    }

    public async load(size: number, family: string, url: string): Promise<Font> {
        let ff = new FontFace(family, `url("${url}")`);

        try {
            await ff.load();

            // @ts-ignore
            document.fonts.add(ff);

            return new Font(size, family);
        } catch (reason) {
            throw new Error(`Failed to load font: ${reason}`);
        }
    }

    public async loadBitmap(pngPath: string, fntPath: string): Promise<BitmapFont> {
        const tex = await this._texLoader.load(pngPath);
        const res = await fetch(fntPath);

        if (res.ok) {
            const data = await res.text();
            return new BitmapFont(tex, data);
        }

        throw new Error(`Failed to load bitmapfont properties file from ${fntPath}`);
    }
}