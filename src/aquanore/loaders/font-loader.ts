import { Font } from "../graphics";

export class FontLoader {
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
}