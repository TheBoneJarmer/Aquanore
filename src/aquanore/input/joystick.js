export class Joystick {
    static init() {
        this.#initEventHandlers();
    }

    static #initEventHandlers() {
        window.addEventListener("gamepadconnected", this.#onConnect);
        window.addEventListener("gamepaddisconnected", this.#onDisconnect);
    }

    static update() {
        
    }

    /* GAMEPAD */
    static getGamepads() {
        return navigator.getGamepads().filter(x => x != null);
    }

    static getGamepad(jid) {
        const gamepads = this.getGamepads();
        const gamepad = gamepads.find(x => x.index == jid);

        if (gamepad == null) {
            throw new Error("Gamepad is not connected");
        }

        return gamepad;
    }

    static getButtons(jid) {
        const gamepad = this.getGamepad(jid);
        return gamepad.buttons.map(x => x.value == 1);
    }

    static getAxes(jid) {
        const gamepad = this.getGamepad(jid);
        return gamepad.axes.map(x => Math.round(x * 1000) / 1000);
    }

    static isConnected(jid) {
        const gamepads = this.getGamepads();
        return gamepads.find(x => x.index == jid) != null;
    }

    static isButtonPressed(jid, button) {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].pressed;
    }

    static isButtonTouched(jid, button) {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].touched;
    }

    static getAxis(jid, axis) {
        const gamepad = this.getGamepad(jid);

        if (axis < 0 || axis >= gamepad.axes.length) {
            throw new Error("Gamepad axis index out of bounds");
        }

        return gamepad.axes[axis];
    }

    static getName(jid) {
        const gamepad = this.getGamepad(jid);
        return gamepad.id;
    }

    /* CALLBACKS */
    static #onConnect(eEvent) {
        const gamepad = e.gamepad;
    }

    static #onDisconnect(eEvent) {
        const gamepad = e.gamepad;
    }
}