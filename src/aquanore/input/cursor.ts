import { Aquanore } from "../aquanore";

export class Cursor {
    private static _states: number[];
    private static _x: number;
    private static _y: number;
    private static _prevX: number;
    private static _prevY: number;
    private static _moveX: number;
    private static _moveY: number;
    private static _wheelX: number;
    private static _wheelY: number;

    static get x(): number {
        return this._x;
    }

    static get y(): number {
        return this._y;
    }

    static get prevX(): number {
        return this._prevX;
    }

    static get prevY(): number {
        return this._prevY;
    }

    static get moveX(): number {
        return this._moveX;
    }

    static get moveY(): number {
        return this._moveY;
    }

    static get wheelX(): number {
        return this._wheelX;
    }

    static get wheelY(): number {
        return this._wheelY;
    }

    static isButtonDown(button: number): boolean {
        return this._states[button] > 0 && this._states[button] < 3;
    }

    static isButtonUp(button: number): boolean {
        return this._states[button] == 3;
    }

    static isButtonPressed(button: number): boolean {
        return this._states[button] == 1;
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.__initStates();
    }

    private static __initStates() {
        for (let i = 0; i < 10; i++) {
            this._states[i] = 0;
        }

        this.__initListeners();
    }

    private static __initListeners() {
        const cnv = Aquanore.canvas;

        cnv.addEventListener("pointerdown", (e) => {
            this._states[e.button] = 1;
            this._x = e.clientX - cnv.getBoundingClientRect().left;
            this._y = e.clientY - cnv.getBoundingClientRect().top;
        });
        cnv.addEventListener("pointermove", (e) => {
            this._prevX = this._x;
            this._prevY = this._y;
            this._x = e.clientX - cnv.getBoundingClientRect().left;
            this._y = e.clientY - cnv.getBoundingClientRect().top;
            this._moveX = this._prevX - this._x;
            this._moveY = this._prevY - this._y;
        });
        cnv.addEventListener("pointerup", (e) => {
            if (this._states[e.button] === 2) {
                this._states[e.button] = 3;
            }

            this._x = e.clientX - cnv.getBoundingClientRect().left;
            this._y = e.clientY - cnv.getBoundingClientRect().top;
        });

        cnv.addEventListener("wheel", (ev) => {
            this._wheelX = ev.deltaX;
            this._wheelY = ev.deltaY;
        });

        cnv.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }

    static __update() {
        this._moveX = 0;
        this._moveY = 0;
        this._wheelX = 0;
        this._wheelY = 0;

        for (let i = 0; i < this._states.length; i++) {
            const state = this._states[i];

            if (state === 1) {
                this._states[i] = 2;
            }

            if (state === 3) {
                this._states[i] = 0;
            }
        }
    }
}
