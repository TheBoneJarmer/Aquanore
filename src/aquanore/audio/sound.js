import { Audio } from "./audio";

export class Sound {
    #buffer = null;

    get buffer() {
        return this.#buffer;
    }

    constructor(path) {
        fetch(path).then(async (res) => {
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await Audio.ctx.decodeAudioData(arrayBuffer);

            this.#buffer = audioBuffer;
        });
    }
}