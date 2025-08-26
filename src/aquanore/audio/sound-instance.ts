import { SoundStatus } from "../enums";

export class SoundInstance {
    private _srcNode: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _status: SoundStatus;

    public get source(): AudioBufferSourceNode {
        return this._srcNode;
    }

    public get status(): SoundStatus {
        return this._status;
    }

    public get volume(): number {
        return Math.round(this._gainNode.gain.value * 100) / 100;
    }

    public set volume(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > 2) {
            value = 2;
        }

        this._gainNode.gain.value = value;
    }

    public get loop(): boolean {
        return this._srcNode.loop;
    }

    public set loop(value: boolean) {
        this._srcNode.loop = value;
    }

    constructor(srcNode: AudioBufferSourceNode, gainNode: GainNode) {
        this._gainNode = gainNode;
        this._srcNode = srcNode;
        this._srcNode.onended = () => {
            this._status = SoundStatus.STOPPED;
        };

        this._status = SoundStatus.PLAYING;
    }

    public stop() {
        this._srcNode.stop();
    }
}