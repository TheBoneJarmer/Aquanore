import { Keys } from "../enums";

class KeyState {
    code = null;
    key = 0;
    value = 0;

    constructor(code, key) {
        this.code = code;
        this.key = key;
        this.value = 0;
    }
}

export class Keyboard {
    static #states= [];

    static init() {
        this.#initStates();
        this.#initListeners();
    }

    static #initListeners() {
        window.addEventListener("keydown", (e) => {
            const state = this.#getStateByCode(e.code);

            if (state == null) {
                return;
            }

            if (state.value == 0) {
                state.value = 1;
            }
        });

        window.addEventListener("keyup", (e) => {
            const state = this.#getStateByCode(e.code);

            if (state == null) {
                return;
            }

            state.value = 3;
        });
    }

    static #initStates() {
        this.#states.push(new KeyState('ArrowUp', Keys.Up));
        this.#states.push(new KeyState('ArrowDown', Keys.Down));
        this.#states.push(new KeyState('ArrowLeft', Keys.Left));
        this.#states.push(new KeyState('ArrowRight', Keys.Right));
        this.#states.push(new KeyState('Space', Keys.Space));
        this.#states.push(new KeyState('Enter', Keys.Enter));
        this.#states.push(new KeyState('ShiftLeft', Keys.LeftShift));
        this.#states.push(new KeyState('ShiftRight', Keys.RightShift));
        this.#states.push(new KeyState('ControlLeft', Keys.LeftCtrl));
        this.#states.push(new KeyState('ControlRight', Keys.RightCtrl));
        this.#states.push(new KeyState('Tab', Keys.Tab));
        this.#states.push(new KeyState('AltLeft', Keys.AltLeft));
        this.#states.push(new KeyState('AltRight', Keys.AltRight));
        this.#states.push(new KeyState('Escape', Keys.Escape));
        this.#states.push(new KeyState('Backspace', Keys.Backspace));
        this.#states.push(new KeyState('Home', Keys.Home));
        this.#states.push(new KeyState('End', Keys.End));
        this.#states.push(new KeyState('Delete', Keys.Delete));
        this.#states.push(new KeyState('Insert', Keys.Insert));
        this.#states.push(new KeyState('PageUp', Keys.PageUp));
        this.#states.push(new KeyState('PageDown', Keys.PageDown));

        this.#states.push(new KeyState('KeyA', Keys.A));
        this.#states.push(new KeyState('KeyB', Keys.B));
        this.#states.push(new KeyState('KeyC', Keys.C));
        this.#states.push(new KeyState('KeyD', Keys.D));
        this.#states.push(new KeyState('KeyE', Keys.E));
        this.#states.push(new KeyState('KeyF', Keys.F));
        this.#states.push(new KeyState('KeyG', Keys.G));
        this.#states.push(new KeyState('KeyH', Keys.H));
        this.#states.push(new KeyState('KeyI', Keys.I));
        this.#states.push(new KeyState('KeyJ', Keys.J));
        this.#states.push(new KeyState('KeyK', Keys.K));
        this.#states.push(new KeyState('KeyL', Keys.L));
        this.#states.push(new KeyState('KeyM', Keys.M));
        this.#states.push(new KeyState('KeyN', Keys.N));
        this.#states.push(new KeyState('KeyO', Keys.O));
        this.#states.push(new KeyState('KeyP', Keys.P));
        this.#states.push(new KeyState('KeyQ', Keys.Q));
        this.#states.push(new KeyState('KeyR', Keys.R));
        this.#states.push(new KeyState('KeyS', Keys.S));
        this.#states.push(new KeyState('KeyT', Keys.T));
        this.#states.push(new KeyState('KeyU', Keys.U));
        this.#states.push(new KeyState('KeyV', Keys.V));
        this.#states.push(new KeyState('KeyW', Keys.W));
        this.#states.push(new KeyState('KeyX', Keys.X));
        this.#states.push(new KeyState('KeyY', Keys.Y));
        this.#states.push(new KeyState('KeyZ', Keys.Z));

        this.#states.push(new KeyState('Digit0', Keys.D0));
        this.#states.push(new KeyState('Digit1', Keys.D1));
        this.#states.push(new KeyState('Digit2', Keys.D2));
        this.#states.push(new KeyState('Digit3', Keys.D3));
        this.#states.push(new KeyState('Digit4', Keys.D4));
        this.#states.push(new KeyState('Digit5', Keys.D5));
        this.#states.push(new KeyState('Digit6', Keys.D6));
        this.#states.push(new KeyState('Digit7', Keys.D7));
        this.#states.push(new KeyState('Digit8', Keys.D8));
        this.#states.push(new KeyState('Digit9', Keys.D9));

        this.#states.push(new KeyState('Minus', Keys.Minus));
        this.#states.push(new KeyState('Equal', Keys.Equal));
        this.#states.push(new KeyState('BracketLeft', Keys.BracketLeft));
        this.#states.push(new KeyState('BracketRight', Keys.BracketRight));
        this.#states.push(new KeyState('Backslash', Keys.Backslash));
        this.#states.push(new KeyState('Slash', Keys.Slash));
        this.#states.push(new KeyState('Period', Keys.Period));
        this.#states.push(new KeyState('Comma', Keys.Comma));
        this.#states.push(new KeyState('Semicolon', Keys.Semicolon));
        this.#states.push(new KeyState('Backquote', Keys.Backquote));
        this.#states.push(new KeyState('Quote', Keys.Quote));

        this.#states.push(new KeyState('Numpad0', Keys.Numpad0));
        this.#states.push(new KeyState('Numpad1', Keys.Numpad1));
        this.#states.push(new KeyState('Numpad2', Keys.Numpad2));
        this.#states.push(new KeyState('Numpad3', Keys.Numpad3));
        this.#states.push(new KeyState('Numpad4', Keys.Numpad4));
        this.#states.push(new KeyState('Numpad5', Keys.Numpad5));
        this.#states.push(new KeyState('Numpad6', Keys.Numpad6));
        this.#states.push(new KeyState('Numpad7', Keys.Numpad7));
        this.#states.push(new KeyState('Numpad8', Keys.Numpad8));
        this.#states.push(new KeyState('Numpad9', Keys.Numpad9));
        this.#states.push(new KeyState('NumpadDivide', Keys.NumpadDivide));
        this.#states.push(new KeyState('NumpadMultiply', Keys.NumpadMultiply));
        this.#states.push(new KeyState('NumpadSubtract', Keys.NumpadSubtract));
        this.#states.push(new KeyState('NumpadAdd', Keys.NumpadAdd));
        this.#states.push(new KeyState('NumpadEnter', Keys.NumpadEnter));
        this.#states.push(new KeyState('NumpadDecimal', Keys.NumpadDecimal));
    }

    static update() {
        for (let i = 0; i < this.#states.length; i++) {
            const state = this.#states[i];

            if (state.value == 1) {
                this.#states[i].value = 2;
            }

            if (state.value == 3) {
                this.#states[i].value = 0;
            }
        }
    }

    static keyDown(key) {
        const state = this.#getStateByKey(key);

        if (state != null) {
            return state.value > 0;
        }

        return false;
    }

    static keyUp(key) {
        const state = this.#getStateByKey(key);

        if (state != null) {
            return state.value == 3;
        }

        return false;
    }

    static keyPressed(key) {
        const state = this.#getStateByKey(key);

        if (state != null) {
            return state.value == 1;
        }

        return false;
    }

    /* HELPER FUNCTIONS */
    static #getStateByKey(key) {
        for (let state of this.#states) {
            if (state.key == key) {
                return state;
            }
        }

        return null;
    }

    static #getStateByCode(code) {
        for (let state of this.#states) {
            if (state.code == code) {
                return state;
            }
        }

        return null;
    }
}
