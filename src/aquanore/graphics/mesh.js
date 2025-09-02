export class Mesh {
    #primitives = [];
    
    get primitives() {
        return this.#primitives;
    }

    constructor() {
        this.#primitives = [];
    }
}