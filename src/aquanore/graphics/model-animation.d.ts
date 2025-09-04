import { ModelAnimationChannel } from "./model-animation-channel";

export class ModelAnimation {
    get name(): string;
    set name(value: string);
    get channels(): ModelAnimationChannel[];
    set channels(value: ModelAnimationChannel[]);

    constructor();
}