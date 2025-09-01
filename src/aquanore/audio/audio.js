import { SoundInstance } from "./sound-instance";

export class Audio {
    static #ctx = null;

    static get ctx() {
        if (this.#ctx == null) {
            this.#ctx = new AudioContext();
        }

        return this.#ctx;
    }

    static async play(sound) {
        const gain = this.ctx.createGain();
        gain.connect(this.ctx.destination);

        const src = this.ctx.createBufferSource();
        src.buffer = sound.buffer;
        src.connect(gain);
        src.start();

        return new SoundInstance(src, gain);
    }

    static async suspend() {
        await this.ctx.suspend();
    }

    static async resume() {
        await this.ctx.resume();
    }
}