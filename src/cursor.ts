import {Aquanore} from "./aquanore";

export class Cursor {
    private static _states: number[] = [];
    private static _x: number = 0;
    private static _y: number = 0;
    private static _prevX: number = 0;
    private static _prevY: number = 0;
    private static _moveX: number = 0;
    private static _moveY: number = 0;

    public static get x(): number {
        return this._x;
    }

    public static get y(): number {
        return this._y;
    }

    public static get prevX(): number {
        return this._prevX;
    }

    public static get prevY(): number {
        return this._prevY;
    }

    public static get moveX(): number {
        return this._moveX;
    }

    public static get moveY(): number {
        return this._moveY;
    }

    public static init() {
        this.initStates();
    }

    private static initStates() {
        for (let i=0; i<10; i++) {
            this._states[i] = 0;
        }

        this.initListeners();
    }

    private static initListeners() {
        const cnv = Aquanore.canvas;
    
        cnv.addEventListener("pointerdown", function (e) {
            Cursor._states[e.button] = 1;
            Cursor._x = e.clientX - Aquanore.canvas.getBoundingClientRect().left;
            Cursor._y = e.clientY - Aquanore.canvas.getBoundingClientRect().top;
        });
        cnv.addEventListener("pointermove", function (e) {
            Cursor._prevX = Cursor._x;
            Cursor._prevY = Cursor._y;
            Cursor._x = e.clientX - Aquanore.canvas.getBoundingClientRect().left;
            Cursor._y = e.clientY - Aquanore.canvas.getBoundingClientRect().top;
            Cursor._moveX = Cursor._prevX - Cursor._x;
            Cursor._moveY = Cursor._prevY - Cursor._y;
        });
        cnv.addEventListener("pointerup", function (e) {
            if (Cursor._states[e.button] === 2) {
                Cursor._states[e.button] = 3;
            }

            Cursor._x = e.clientX - Aquanore.canvas.getBoundingClientRect().left;
            Cursor._y = e.clientY - Aquanore.canvas.getBoundingClientRect().top;
        });

        cnv.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }

    public static update() {
        this._moveX = 0;
        this._moveY = 0;

        for (let i=0; i<this._states.length; i++) {
            const state = this._states[i];

            if (state === 1) {
                this._states[i] = 2;
            }

            if (state === 3) {
                this._states[i] = 0;
            }
        }
    }

    public static isButtonDown(button: number): boolean {
        return this._states[button] > 0 && this._states[button] < 3;
    }

    public static isButtonUp(button: number): boolean {
        return this._states[button] == 3;
    }

    public static isButtonPressed(button: number): boolean {
        return this._states[button] == 1;
    }
}
