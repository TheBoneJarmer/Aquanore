import { Keys } from "./enums";

export class KeyState {
    public code: string;
    public key: Keys;
    public value: number;

    constructor(code: string, key: Keys) {
        this.code = code;
        this.key = key;
        this.value = 0;
    }
}