import { Audio } from "./audio";

export class Sound {
    private _buffer: AudioBuffer;

    get buffer(): AudioBuffer {
        return this._buffer;
    }

    constructor(path: string) {
        fetch(path).then(async (res) => {
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await Audio.ctx.decodeAudioData(arrayBuffer);

            this._buffer = audioBuffer;
        });
    }
}