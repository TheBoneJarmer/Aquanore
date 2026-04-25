export class Sound {
    private _buffer: AudioBuffer;

    /**
     * Returns the audio buffer
     * @returns {AudioBuffer}
     */
    get buffer(): AudioBuffer {
        return this._buffer;
    }

    /**
     * Constructs a sound instance from an `AudioBuffer` object
     * @param {AudioBuffer} buffer The audio buffer
     */
    constructor(buffer: AudioBuffer) {
        this._buffer = buffer;
    }
}