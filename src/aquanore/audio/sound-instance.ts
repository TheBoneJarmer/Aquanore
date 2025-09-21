import { SoundStatus } from "../enums";

export class SoundInstance {
    private _srcNode: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _status: SoundStatus;

    get source(): AudioBufferSourceNode {
        return this._srcNode;
    }

    get status(): SoundStatus {
        return this._status;
    }

    get volume(): number {
        return Math.round(this._gainNode.gain.value * 100) / 100;
    }

    set volume(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > 2) {
            value = 2;
        }

        this._gainNode.gain.value = value;
    }

    get loop(): boolean {
        return this._srcNode.loop;
    }

    set loop(value: boolean) {
        this._srcNode.loop = value;
    }

    constructor(srcNode: AudioBufferSourceNode, gainNode: GainNode) {
        this._gainNode = gainNode;
        this._srcNode = srcNode;
        this._srcNode.onended = () => {
            this._status = SoundStatus.Stopped;
        };

        this._status = SoundStatus.Playing;
    }

    stop() {
        this._srcNode.stop();
    }
}