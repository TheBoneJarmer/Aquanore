import { SoundStatus } from "../enums";

export class SoundInstance {
    #srcNode = null;
    #gainNode = null;
    #status = 0;

    get source() {
        return this.#srcNode;
    }

    get status() {
        return this.#status;
    }

    get volume() {
        return Math.round(this.#gainNode.gain.value * 100) / 100;
    }

    set volume(value) {
        if (value < 0) {
            value = 0;
        }

        if (value > 2) {
            value = 2;
        }

        this.#gainNode.gain.value = value;
    }

    get loop() {
        return this.#srcNode.loop;
    }

    set loop(value) {
        this.#srcNode.loop = value;
    }

    constructor(srcNode, gainNode) {
        this.#gainNode = gainNode;
        this.#srcNode = srcNode;
        this.#srcNode.onended = () => {
            this.#status = SoundStatus.Stopped;
        };

        this.#status = SoundStatus.Playing;
    }

    stop() {
        this.#srcNode.stop();
    }
}