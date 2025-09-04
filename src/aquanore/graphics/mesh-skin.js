export class MeshSkin {
    #joints = [];
    #matrices = [];

    get joints() {
        return this.#joints;
    }

    set joints(value) {
        this.#joints = value;
    }

    get matrices() {
        return this.#matrices;
    }

    set matrices(value) {
        this.#matrices = value;
    }
}