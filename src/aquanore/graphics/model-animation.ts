import { ModelAnimationChannel } from "./model-animation-channel";

export class ModelAnimation {
    private _name: string;
    private _channels: ModelAnimationChannel[];

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get channels(): ModelAnimationChannel[] {
        return this._channels;
    }

    set channels(value: ModelAnimationChannel[]) {
        this._channels = value;
    }

    constructor() {
        this._name = "Animation";
        this._channels = [];
    }

    getDuration(): number {
        let result = 0;

        for (let channel of this._channels) {
            const max = Math.max(...channel.input);

            if (max > result) {
                result = max;
            }
        }

        return result;
    }
}