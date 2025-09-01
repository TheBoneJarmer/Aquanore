export class Model {
    #meshes = [];

    get meshes() {
        return this.#meshes;
    }

    constructor() {
        this.#meshes = [];
    }
}