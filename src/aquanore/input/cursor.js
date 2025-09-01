import { Aquanore } from "../aquanore";

export class Cursor {
    static #states = [];
    static #x = 0;
    static #y = 0;
    static #prevX = 0;
    static #prevY = 0;
    static #moveX = 0;
    static #moveY = 0;

    static get x() {
        return this.#x;
    }

    static get y() {
        return this.#y;
    }

    static get prevX() {
        return this.#prevX;
    }

    static get prevY() {
        return this.#prevY;
    }

    static get moveX() {
        return this.#moveX;
    }

    static get moveY() {
        return this.#moveY;
    }

    static init() {
        this.#initStates();
    }

    static #initStates() {
        for (let i = 0; i < 10; i++) {
            this.#states[i] = 0;
        }

        this.#initListeners();
    }

    static #initListeners() {
        const cnv = Aquanore.canvas;

        cnv.addEventListener("pointerdown", (e) => {
            this.#states[e.button] = 1;
            this.#x = e.clientX - cnv.getBoundingClientRect().left;
            this.#y = e.clientY - cnv.getBoundingClientRect().top;
        });
        cnv.addEventListener("pointermove", (e) => {
            this.#prevX = this.#x;
            this.#prevY = this.#y;
            this.#x = e.clientX - cnv.getBoundingClientRect().left;
            this.#y = e.clientY - cnv.getBoundingClientRect().top;
            this.#moveX = this.#prevX - this.#x;
            this.#moveY = this.#prevY - this.#y;
        });
        cnv.addEventListener("pointerup", (e) => {
            if (this.#states[e.button] === 2) {
                this.#states[e.button] = 3;
            }

            this.#x = e.clientX - cnv.getBoundingClientRect().left;
            this.#y = e.clientY - cnv.getBoundingClientRect().top;
        });

        cnv.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }

    static update() {
        this.#moveX = 0;
        this.#moveY = 0;

        for (let i = 0; i < this.#states.length; i++) {
            const state = this.#states[i];

            if (state === 1) {
                this.#states[i] = 2;
            }

            if (state === 3) {
                this.#states[i] = 0;
            }
        }
    }

    static isButtonDown(button) {
        return this.#states[button] > 0 && this.#states[button] < 3;
    }

    static isButtonUp(button) {
        return this.#states[button] == 3;
    }

    static isButtonPressed(button) {
        return this.#states[button] == 1;
    }
}
