export class Joystick {
    static init() {
        this.initEventHandlers();
    }

    private static initEventHandlers() {
        window.addEventListener("gamepadconnected", this.onConnect);
        window.addEventListener("gamepaddisconnected", this.onDisconnect);
    }

    static update() {
        
    }

    /* GAMEPAD */
    public static getGamepads(): Gamepad[] {
        return navigator.getGamepads().filter(x => x != null);
    }

    public static getGamepad(jid: number): Gamepad {
        const gamepads = this.getGamepads();
        const gamepad = gamepads.find(x => x.index == jid);

        if (gamepad == null) {
            throw new Error("Gamepad is not connected");
        }

        return gamepad;
    }

    public static getButtons(jid: number): boolean[] {
        const gamepad = this.getGamepad(jid);
        return gamepad.buttons.map(x => x.value == 1);
    }

    public static getAxes(jid: number): number[] {
        const gamepad = this.getGamepad(jid);
        return gamepad.axes.map(x => Math.round(x * 1000) / 1000);
    }

    public static isConnected(jid: number): boolean {
        const gamepads = this.getGamepads();
        return gamepads.find(x => x.index == jid) != null;
    }

    public static isButtonPressed(jid: number, button: number): boolean {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].pressed;
    }

    public static isButtonTouched(jid: number, button: number): boolean {
        const gamepad = this.getGamepad(jid);

        if (button < 0 || button >= gamepad.buttons.length) {
            throw new Error("Gamepad button index out of bounds");
        }

        return gamepad.buttons[button].touched;
    }

    public static getAxis(jid: number, axis: number): number {
        const gamepad = this.getGamepad(jid);

        if (axis < 0 || axis >= gamepad.axes.length) {
            throw new Error("Gamepad axis index out of bounds");
        }

        return gamepad.axes[axis];
    }

    public static getName(jid: number): string {
        const gamepad = this.getGamepad(jid);
        return gamepad.id;
    }

    /* CALLBACKS */
    private static onConnect(e: GamepadEvent) {
        const gamepad = e.gamepad;
    }

    private static onDisconnect(e: GamepadEvent) {
        const gamepad = e.gamepad;
    }
}