import { Sound } from "./sound";

export class Audio {
    static get ctx(): AudioContext;
    static play(sound: Sound): Promise<void>;
    static suspend(): Promise<void>;
    static resume(): Promise<void>;
}