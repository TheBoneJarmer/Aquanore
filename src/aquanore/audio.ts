import { Sound } from "./sound";
import { SoundInstance } from "./sound-instance";

export class Audio {
    private static _ctx: AudioContext;

    public static get ctx(): AudioContext {
        if (this._ctx == null) {
            this._ctx = new AudioContext();
        }

        return this._ctx;
    }

    public static async play(sound: Sound): Promise<SoundInstance> {
        const gain = this.ctx.createGain();
        gain.connect(this.ctx.destination);

        const src = this.ctx.createBufferSource();
        src.buffer = sound.buffer;
        src.connect(gain);
        src.start();

        return new SoundInstance(src, gain);
    }

    public static async suspend() {
        await this.ctx.suspend();
    }

    public static async resume() {
        await this.ctx.resume();
    }
}