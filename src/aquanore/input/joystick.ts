export class Joystick {
    static getGamepads(): Gamepad[] {
        return navigator.getGamepads().filter(x => x != null);
    }

    static getGamepad(jid: number): Gamepad {
        const gamepads = this.getGamepads();
        const gamepad = gamepads.find(x => x.index == jid);

        if (gamepad == null) {
            throw new Error("Gamepad is not connected");
        }

        return gamepad;
    }

    static getButtons(jid: number): boolean[] {
        const gamepad = this.getGamepad(jid);
        return gamepad.buttons.map(x => x.value == 1);
    }

    static getAxes(jid: number): number[] {
        const gamepad = this.getGamepad(jid);
        return gamepad.axes.map(x => Math.round(x * 1000) / 1000);
    }

    static isConnected(jid: number): boolean {
        const gamepads = this.getGamepads();
        return gamepads.find(x => x.index == jid) != null;
    }

    static isButtonPressed(jid: number, button: number): boolean {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].pressed;
    }

    static isButtonTouched(jid: number, button: number): boolean {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].touched;
    }

    static getAxis(jid: number, axis: number): number {
        const gamepad = this.getGamepad(jid);

        if (axis < 0 || axis >= gamepad.axes.length) {
            throw new Error("Gamepad axis index out of bounds");
        }

        return gamepad.axes[axis];
    }

    static getName(jid: number): string {
        const gamepad = this.getGamepad(jid);
        return gamepad.id;
    }

    /* INTERNAL FUNCTIONS */
    static async __init() {
        window.addEventListener("gamepadconnected", this.onConnect);
        window.addEventListener("gamepaddisconnected", this.onDisconnect);
    }

    /* CALLBACKS */
    private static onConnect(e: GamepadEvent) {
        const gamepad = e.gamepad;
    }

    private static onDisconnect(e: GamepadEvent) {
        const gamepad = e.gamepad;
    }
}