import { Audio, Sound } from "../audio";

export class AudioLoader {
    async load(path: string): Promise<Sound> {
        const res = await fetch(path);

        if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await Audio.ctx.decodeAudioData(arrayBuffer);

            return new Sound(audioBuffer);
        }
    }
}