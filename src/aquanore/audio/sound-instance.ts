import { SoundStatus } from "../enums";

export class SoundInstance {
    private _srcNode: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _status: SoundStatus;

    /**
     * Returns the `AudioBufferSourceNode` instance
     * @returns {AudioBufferSourceNode}
     */
    get source(): AudioBufferSourceNode {
        return this._srcNode;
    }

    /**
     * Returns the sound status
     * @returns {SoundStatus}
     */
    get status(): SoundStatus {
        return this._status;
    }

    /**
     * Returns the volume
     * @returns {number}
     */
    get volume(): number {
        return Math.round(this._gainNode.gain.value * 100) / 100;
    }

    /**
     * Sets the volume
     * @param {number} value
     */
    set volume(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > 2) {
            value = 2;
        }

        this._gainNode.gain.value = value;
    }

    /**
     * Returns `true` if the audio was set to loop or `false` if it was not
     * @returns {boolean}
     */
    get loop(): boolean {
        return this._srcNode.loop;
    }

    /**
     * Sets the loop value
     * @param {boolean} value
     */
    set loop(value: boolean) {
        this._srcNode.loop = value;
    }

    /**
     * Constructs an sound instance from a source node and gain node.
     * @param srcNode The buffer source node
     * @param gainNode The gain node
     */
    constructor(srcNode: AudioBufferSourceNode, gainNode: GainNode) {
        this._gainNode = gainNode;
        this._srcNode = srcNode;
        this._srcNode.onended = () => {
            this._status = SoundStatus.Stopped;
        };

        this._status = SoundStatus.Playing;
    }

    /**
     * Stops the audio from playing
     */
    stop() {
        this._srcNode.stop();
    }
}