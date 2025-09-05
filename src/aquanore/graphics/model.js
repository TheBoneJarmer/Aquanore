export class Model {
    #meshes = [];
    #joints = [];
    #animations = [];
    #skins = [];
    
    get meshes() {
        return this.#meshes;
    }

    set meshes(value) {
        this.#meshes = value;
    }

    get animations() {
        return this.#animations;
    }

    set animations(value) {
        this.#animations = value;
    }

    get joints() {
        return this.#joints;
    }

    set joints(value) {
        this.#joints = value;
    }

    get skins() {
        return this.#skins;
    }

    set skins(value) {
        this.#skins = value;
    }

    constructor() {
        this.#meshes = [];
        this.#animations = [];
        this.#joints = [];
        this.#skins = [];
    }
}