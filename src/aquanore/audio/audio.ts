import { Sound } from "./sound";
import { SoundInstance } from "./sound-instance";

export class Audio {
    private static _ctx: AudioContext;

    static get ctx(): AudioContext {
        return this._ctx;
    }

    static async play(sound: Sound): Promise<SoundInstance> {
        const gain = this._ctx.createGain();
        gain.connect(this._ctx.destination);

        const src = this._ctx.createBufferSource();
        src.buffer = sound.buffer;
        src.connect(gain);
        src.start();

        return new SoundInstance(src, gain);
    }

    static async suspend() {
        await this._ctx.suspend();
    }

    static async resume() {
        await this._ctx.resume();
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this._ctx = new AudioContext();
    }
}