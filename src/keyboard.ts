export enum Keys {
    Escape,
    Up,
    Down,
    Left,
    Right,
    Space,
    Enter,
    LeftShift,
    RightShift,
    LeftCtrl,
    RightCtrl,
    Tab,
    AltLeft,
    AltRight,
    Backspace,
    Home,
    End,
    Insert,
    Delete,
    PageUp,
    PageDown,
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z
}

class KeyboardState {
    public code: string;
    public key: Keys;
    public value: number;

    public constructor(code: string, key: Keys) {
        this.code = code;
        this.key = key;
        this.value = 0;
    }
}

export class Keyboard {
    private static readonly _states: KeyboardState[] = [];

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
        this._states.push(new KeyboardState('ArrowUp', Keys.Up));
        this._states.push(new KeyboardState('ArrowDown', Keys.Down));
        this._states.push(new KeyboardState('ArrowLeft', Keys.Left));
        this._states.push(new KeyboardState('ArrowRight', Keys.Right));
        this._states.push(new KeyboardState('Space', Keys.Space));
        this._states.push(new KeyboardState('Enter', Keys.Enter));
        this._states.push(new KeyboardState('ShiftLeft', Keys.LeftShift));
        this._states.push(new KeyboardState('ShiftRight', Keys.RightShift));
        this._states.push(new KeyboardState('ControlLeft', Keys.LeftCtrl));
        this._states.push(new KeyboardState('ControlRight', Keys.RightCtrl));
        this._states.push(new KeyboardState('Tab', Keys.Tab));
        this._states.push(new KeyboardState('AltLeft', Keys.AltLeft));
        this._states.push(new KeyboardState('AltRight', Keys.AltRight));
        this._states.push(new KeyboardState('Escape', Keys.Escape));
        this._states.push(new KeyboardState('Backspace', Keys.Backspace));
        this._states.push(new KeyboardState('Home', Keys.Home));
        this._states.push(new KeyboardState('End', Keys.End));
        this._states.push(new KeyboardState('Delete', Keys.Delete));
        this._states.push(new KeyboardState('Insert', Keys.Insert));
        this._states.push(new KeyboardState('PageUp', Keys.PageUp));
        this._states.push(new KeyboardState('PageDown', Keys.PageDown));

        this._states.push(new KeyboardState('KeyA', Keys.A));
        this._states.push(new KeyboardState('KeyB', Keys.B));
        this._states.push(new KeyboardState('KeyC', Keys.C));
        this._states.push(new KeyboardState('KeyD', Keys.D));
        this._states.push(new KeyboardState('KeyE', Keys.E));
        this._states.push(new KeyboardState('KeyF', Keys.F));
        this._states.push(new KeyboardState('KeyG', Keys.G));
        this._states.push(new KeyboardState('KeyH', Keys.H));
        this._states.push(new KeyboardState('KeyI', Keys.I));
        this._states.push(new KeyboardState('KeyJ', Keys.J));
        this._states.push(new KeyboardState('KeyK', Keys.K));
        this._states.push(new KeyboardState('KeyL', Keys.L));
        this._states.push(new KeyboardState('KeyM', Keys.M));
        this._states.push(new KeyboardState('KeyN', Keys.N));
        this._states.push(new KeyboardState('KeyO', Keys.O));
        this._states.push(new KeyboardState('KeyP', Keys.P));
        this._states.push(new KeyboardState('KeyQ', Keys.Q));
        this._states.push(new KeyboardState('KeyR', Keys.R));
        this._states.push(new KeyboardState('KeyS', Keys.S));
        this._states.push(new KeyboardState('KeyT', Keys.T));
        this._states.push(new KeyboardState('KeyU', Keys.U));
        this._states.push(new KeyboardState('KeyV', Keys.V));
        this._states.push(new KeyboardState('KeyW', Keys.W));
        this._states.push(new KeyboardState('KeyX', Keys.X));
        this._states.push(new KeyboardState('KeyY', Keys.Y));
        this._states.push(new KeyboardState('KeyZ', Keys.Z));
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
    private static getStateByKey(key: Keys): KeyboardState {
        for (let state of this._states) {
            if (state.key == key) {
                return state;
            }
        }

        return null;
    }

    private static getStateByCode(code: string): KeyboardState {
        for (let state of this._states) {
            if (state.code == code) {
                return state;
            }
        }

        return null;
    }
}