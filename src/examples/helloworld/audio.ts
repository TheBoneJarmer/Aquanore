export enum SoundStatus {
    STOPPED,
    PLAYING
}

export class Sound {
    private _buffer: AudioBuffer;

    public get buffer() {
        return this._buffer;
    }

    constructor(path: string) {
        fetch(path).then(async (res) => {
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await Audio.ctx.decodeAudioData(arrayBuffer);

            this._buffer = audioBuffer;
        });
    }
}

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

    public loop(loop: boolean) {
        this._srcNode.loop = loop;
    }
}

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