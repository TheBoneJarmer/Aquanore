export class CanvasOptions {
    private _dom = null;
    private _autoResize = true;

    /**
     * Returns the DOM element setting
     * @returns {HTMLCanvasElement}
     */
    get dom(): HTMLCanvasElement {
        return this._dom;
    }

    /**
     * Sets the DOM element. If this setting is untouched, Aquanore will create a canvas element and append it to the body.
     * @param {HTMLCanvasElement} value
     */
    set dom(value: HTMLCanvasElement) {
        if (value == null) {
            throw new Error("DOM element cannot be null");
        }

        this._dom = value;
    }

    /**
     * Returns the autoResize setting
     * @returns {boolean}
     */
    get autoResize(): boolean {
        return this._autoResize;
    }

    /**
     * If `true`, Aquanore will automically resize the canvas to match the window dimensions.
     * Set this to `false` if you set a canvas element manually or if you wish to control the canvas size.
     * @param {boolean} value
     */
    set autoResize(value: boolean) {
        this._autoResize = value;
    }
}

export class AquanoreOptions {
    private _canvas = new CanvasOptions();

    /**
     * Returns the canvas options
     * @returns {CanvasOptions}
     */
    get canvas(): CanvasOptions {
        return this._canvas;
    }
}