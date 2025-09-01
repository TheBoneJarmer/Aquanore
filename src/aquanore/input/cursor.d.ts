export class Cursor {
    static get x(): number;
    static get y(): number;
    static get prevX(): number;
    static get prevY(): number;
    static get moveX(): number;
    static get moveY(): number;

    static isButtonDown(button: number): boolean;
    static isButtonUp(button: number): boolean;
    static isButtonPressed(button: number): boolean;
}