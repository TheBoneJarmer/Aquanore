import { Sound } from "./sound";
import { SoundInstance } from "./sound-instance";

export class Audio {
    private static _ctx: AudioContext;

    /**
     * Returns the `AudioContext` instance
     * @returns {AudioContext}
     */
    static get ctx(): AudioContext {
        return this._ctx;
    }

    /**
     * Plays a sound and returns the associated sound instance
     * @param sound The sound to play
     * @returns {SoundInstance}
     */
    static async play(sound: Sound): Promise<SoundInstance> {
        const gain = this._ctx.createGain();
        gain.connect(this._ctx.destination);

        const src = this._ctx.createBufferSource();
        src.buffer = sound.buffer;
        src.connect(gain);
        src.start();

        return new SoundInstance(src, gain);
    }

    /**
     * Suspend all audio
     */
    static async suspend() {
        await this._ctx.suspend();
    }

    /**
     * Resume all audio
     */
    static async resume() {
        await this._ctx.resume();
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this._ctx = new AudioContext();
    }
}