import { SoundStatus } from "../enums";

export class SoundInstance {
    get source(): AudioBufferSourceNode;
    get status(): SoundStatus;
    get volume(): number;
    set volume(value: number);
    get loop(): boolean;
    set loop(value: boolean);

    constructor(srcNode: AudioBufferSourceNode, gainNode: GainNode);

    stop(): void;
}