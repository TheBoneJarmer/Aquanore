export class ModelAnimationChannel {
    #path = null;
    #interpolation = null;
    #input = [];
    #output = [];
    #index = 0;

    get path() {
        return this.#path;
    }

    set path(value) {
        this.#path = value;
    }

    get input() {
        return this.#input;
    }

    set input(value) {
        this.#input = value;
    }

    get output() {
        return this.#output;
    }

    set output(value) {
        this.#output = value;
    }

    get index() {
        return this.#index;
    }

    set index(value) {
        this.#index = value;
    }

    get interpolation() {
        return this.#interpolation;
    }

    set interpolation(value) {
        this.#interpolation = value;
    }

    constructor() {

    }
}