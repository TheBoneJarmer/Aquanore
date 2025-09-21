import { Audio } from "./audio";

export class Sound {
    private _buffer: AudioBuffer;

    get buffer(): AudioBuffer {
        return this._buffer;
    }

    constructor(buffer: AudioBuffer) {
        this._buffer = buffer;
    }
}