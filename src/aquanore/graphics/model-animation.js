export class ModelAnimation {
    #name = null;
    #channels = [];

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get channels() {
        return this.#channels;
    }

    set channels(value) {
        this.#channels = value;
    }

    constructor() {

    }

    getDuration() {
        let result = 0;

        for (let channel of this.#channels) {
            const max = Math.max(...channel.input);

            if (max > result) {
                result = max;
            }
        }

        return result;
    }
}