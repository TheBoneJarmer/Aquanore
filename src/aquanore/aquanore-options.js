export class CanvasOptions {
    #dom = null;
    #autoResize = true;

    /**
     * Returns the DOM element setting
     * @returns {HTMLCanvasElement}
     */
    get dom() {
        return this.#dom;
    }

    /**
     * Sets the DOM element. If this setting is untouched, Aquanore will create a canvas element and append it to the body.
     * @param {HTMLCanvasElement} value
     */
    set dom(value) {
        if (value == null) {
            throw new Error("DOM element cannot be null");
        }

        this.#dom = value;
    }

    /**
     * Returns the autoResize setting
     * @returns {boolean}
     */
    get autoResize() {
        return this.#autoResize;
    }

    /**
     * If `true`, Aquanore will automically resize the canvas to match the window dimensions.
     * Set this to `false` if you set a canvas element manually or if you wish to control the canvas size.
     * @param {boolean} value
     */
    set autoResize(value) {
        this.#autoResize = value;
    }
}

export class AquanoreOptions {
    #canvas = new CanvasOptions();

    /**
     * Returns the canvas options
     * @returns {CanvasOptions}
     */
    get canvas() {
        return this.#canvas;
    }
}