import { Keys } from "./enums";
import { KeyState } from "./structs";

export class Keyboard {
    private static readonly _states: KeyState[] = [];

    public static init() {
        this.initStates();
        this.initListeners();
    }

    private static initListeners() {
        window.addEventListener("keydown", (e) => {
            const state = this.getStateByCode(e.code);

            if (state == null) {
                return;
            }

            if (state.value == 0) {
                state.value = 1;
            }
        });

        window.addEventListener("keyup", (e) => {
            const state = this.getStateByCode(e.code);

            if (state == null) {
                return;
            }

            state.value = 3;
        });
    }

    private static initStates() {
        this._states.push(new KeyState('ArrowUp', Keys.Up));
        this._states.push(new KeyState('ArrowDown', Keys.Down));
        this._states.push(new KeyState('ArrowLeft', Keys.Left));
        this._states.push(new KeyState('ArrowRight', Keys.Right));
        this._states.push(new KeyState('Space', Keys.Space));
        this._states.push(new KeyState('Enter', Keys.Enter));
        this._states.push(new KeyState('ShiftLeft', Keys.LeftShift));
        this._states.push(new KeyState('ShiftRight', Keys.RightShift));
        this._states.push(new KeyState('ControlLeft', Keys.LeftCtrl));
        this._states.push(new KeyState('ControlRight', Keys.RightCtrl));
        this._states.push(new KeyState('Tab', Keys.Tab));
        this._states.push(new KeyState('AltLeft', Keys.AltLeft));
        this._states.push(new KeyState('AltRight', Keys.AltRight));
        this._states.push(new KeyState('Escape', Keys.Escape));
        this._states.push(new KeyState('Backspace', Keys.Backspace));
        this._states.push(new KeyState('Home', Keys.Home));
        this._states.push(new KeyState('End', Keys.End));
        this._states.push(new KeyState('Delete', Keys.Delete));
        this._states.push(new KeyState('Insert', Keys.Insert));
        this._states.push(new KeyState('PageUp', Keys.PageUp));
        this._states.push(new KeyState('PageDown', Keys.PageDown));

        this._states.push(new KeyState('KeyA', Keys.A));
        this._states.push(new KeyState('KeyB', Keys.B));
        this._states.push(new KeyState('KeyC', Keys.C));
        this._states.push(new KeyState('KeyD', Keys.D));
        this._states.push(new KeyState('KeyE', Keys.E));
        this._states.push(new KeyState('KeyF', Keys.F));
        this._states.push(new KeyState('KeyG', Keys.G));
        this._states.push(new KeyState('KeyH', Keys.H));
        this._states.push(new KeyState('KeyI', Keys.I));
        this._states.push(new KeyState('KeyJ', Keys.J));
        this._states.push(new KeyState('KeyK', Keys.K));
        this._states.push(new KeyState('KeyL', Keys.L));
        this._states.push(new KeyState('KeyM', Keys.M));
        this._states.push(new KeyState('KeyN', Keys.N));
        this._states.push(new KeyState('KeyO', Keys.O));
        this._states.push(new KeyState('KeyP', Keys.P));
        this._states.push(new KeyState('KeyQ', Keys.Q));
        this._states.push(new KeyState('KeyR', Keys.R));
        this._states.push(new KeyState('KeyS', Keys.S));
        this._states.push(new KeyState('KeyT', Keys.T));
        this._states.push(new KeyState('KeyU', Keys.U));
        this._states.push(new KeyState('KeyV', Keys.V));
        this._states.push(new KeyState('KeyW', Keys.W));
        this._states.push(new KeyState('KeyX', Keys.X));
        this._states.push(new KeyState('KeyY', Keys.Y));
        this._states.push(new KeyState('KeyZ', Keys.Z));

        this._states.push(new KeyState('Digit0', Keys.D0));
        this._states.push(new KeyState('Digit1', Keys.D1));
        this._states.push(new KeyState('Digit2', Keys.D2));
        this._states.push(new KeyState('Digit3', Keys.D3));
        this._states.push(new KeyState('Digit4', Keys.D4));
        this._states.push(new KeyState('Digit5', Keys.D5));
        this._states.push(new KeyState('Digit6', Keys.D6));
        this._states.push(new KeyState('Digit7', Keys.D7));
        this._states.push(new KeyState('Digit8', Keys.D8));
        this._states.push(new KeyState('Digit9', Keys.D9));

        this._states.push(new KeyState('Minus', Keys.Minus));
        this._states.push(new KeyState('Equal', Keys.Equal));
        this._states.push(new KeyState('BracketLeft', Keys.BracketLeft));
        this._states.push(new KeyState('BracketRight', Keys.BracketRight));
        this._states.push(new KeyState('Backslash', Keys.Backslash));
        this._states.push(new KeyState('Slash', Keys.Slash));
        this._states.push(new KeyState('Period', Keys.Period));
        this._states.push(new KeyState('Comma', Keys.Comma));
        this._states.push(new KeyState('Semicolon', Keys.Semicolon));
        this._states.push(new KeyState('Backquote', Keys.Backquote));
        this._states.push(new KeyState('Quote', Keys.Quote));

        this._states.push(new KeyState('Numpad0', Keys.Numpad0));
        this._states.push(new KeyState('Numpad1', Keys.Numpad1));
        this._states.push(new KeyState('Numpad2', Keys.Numpad2));
        this._states.push(new KeyState('Numpad3', Keys.Numpad3));
        this._states.push(new KeyState('Numpad4', Keys.Numpad4));
        this._states.push(new KeyState('Numpad5', Keys.Numpad5));
        this._states.push(new KeyState('Numpad6', Keys.Numpad6));
        this._states.push(new KeyState('Numpad7', Keys.Numpad7));
        this._states.push(new KeyState('Numpad8', Keys.Numpad8));
        this._states.push(new KeyState('Numpad9', Keys.Numpad9));
        this._states.push(new KeyState('NumpadDivide', Keys.NumpadDivide));
        this._states.push(new KeyState('NumpadMultiply', Keys.NumpadMultiply));
        this._states.push(new KeyState('NumpadSubtract', Keys.NumpadSubtract));
        this._states.push(new KeyState('NumpadAdd', Keys.NumpadAdd));
        this._states.push(new KeyState('NumpadEnter', Keys.NumpadEnter));
        this._states.push(new KeyState('NumpadDecimal', Keys.NumpadDecimal));
    }

    public static update() {
        for (let i = 0; i < this._states.length; i++) {
            const state = this._states[i];

            if (state.value == 1) {
                this._states[i].value = 2;
            }

            if (state.value == 3) {
                this._states[i].value = 0;
            }
        }
    }

    public static keyDown(key: Keys) {
        const state = this.getStateByKey(key);

        if (state != null) {
            return state.value > 0;
        }

        return false;
    }

    public static keyUp(key: Keys) {
        const state = this.getStateByKey(key);

        if (state != null) {
            return state.value == 3;
        }

        return false;
    }

    public static keyPressed(key: Keys) {
        const state = this.getStateByKey(key);

        if (state != null) {
            return state.value == 1;
        }

        return false;
    }

    /* HELPER FUNCTIONS */
    private static getStateByKey(key: Keys): KeyState {
        for (let state of this._states) {
            if (state.key == key) {
                return state;
            }
        }

        return null;
    }

    private static getStateByCode(code: string): KeyState {
        for (let state of this._states) {
            if (state.code == code) {
                return state;
            }
        }

        return null;
    }
}
