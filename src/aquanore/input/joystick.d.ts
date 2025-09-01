export class Joystick {
    static getGamepads(): Gamepad[];
    static getGamepad(jid: number): Gamepad;
    static getButtons(jid: number): number[];
    static getAxes(jid: number): number[];
    static isConnected(jid: number): boolean;
    static isButtonPressed(jid: number, button: number): number;
    static isButtonTouched(jid: number, button: number): number;
    static getAxis(jid: number, axis: number): number;
    static getName(jid: number): string;
}