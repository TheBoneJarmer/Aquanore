export class Cursor {
    private static _states: number[] = [];
    private static _x: number = 0;
    private static _y: number = 0;
    private static _prevX: number = 0;
    private static _prevY: number = 0;
    private static _moveX: number = 0;
    private static _moveY: number = 0;
    private static _scrollX: number = 0;
    private static _scrollY: number = 0;

    public static init() {
        this.initStates();
    }

    private static initStates() {
        for (let i=0; i<10; i++) {
            this._states[i] = 0;
        }
    }

    private static initListeners() {
        window.addEventListener("touchstart", function (e) {
            this.down[id] = true;
            Cursor.#x[id] = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
            Cursor.#y[id] = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
        });
        window.addEventListener("touchmove", function (e) {
            Cursor.#x[id] = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
            Cursor.#y[id] = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
        });
        window.addEventListener("touchend", function (e) {
            Cursor.#x[id] = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
            Cursor.#y[id] = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
            Cursor.#down[id] = false;
            Cursor.#up[id] = true;
        });
    }
}