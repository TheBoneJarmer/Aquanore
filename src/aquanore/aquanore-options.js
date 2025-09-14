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

export class ShadowMapOptions {
    #width = 1024;
    #height = 1024;
    #minFilter = 9728;
    #magFilter = 9728;
    #wrapS = 33071;
    #wrapT = 33071;

    /**
     * Returns the shadowmap's width in pixels
     * @returns {number}
     */
    get width() {
        return this.#width;
    }

    /**
     * Sets the shadowmap's width in pixels
     * @param {number} value
     */
    set width(value) {
        this.#width = value;
    }

    /**
     * Returns the shadowmap's height in pixels
     * @returns {number}
     */
    get height() {
        return this.#height;
    }

    /**
     * Sets the shadowmap's height in pixels
     * @param {number} value
     */
    set height(value) {
        this.#height = value;
    }

    /**
     * Returns the shadowmap's min filter
     * @returns {number}
     */
    get minFilter() {
        return this.#minFilter;
    }

    /**
     * Sets the shadowmap's min filter
     * @param {number} value
     */
    set minFilter(value) {
        this.#minFilter = value;
    }

    /**
     * Returns the shadowmap's mag filter
     * @returns {number}
     */
    get magFilter() {
        return this.#magFilter;
    }

    /**
     * Sets the shadowmap's mag filter
     * @param {number} value
     */
    set magFilter(value) {
        this.#magFilter = value;
    }

    /**
     * Returns the shadowmap's S axis wrap value
     */
    get wrapS() {
        return this.#wrapS;
    }

    /**
     * Sets the shadowmap's S axis wrap value
     * @param {number} value
     */
    set wrapS(value) {
        this.#wrapS = value;
    }

    /**
     * Returns the shadowmap's T axis wrap value
     */
    get wrapT() {
        return this.#wrapT;
    }

    /**
     * Sets the shadowmap's T axis wrap value
     * @param {number} value
     */
    set wrapT(value) {
        this.#wrapT = value;
    }
}

export class ShadowOptions {
    #enabled = true;
    #map = new ShadowMapOptions();

    /**
     * Returns true if the shadowmap is enabled or false if it is not.
     * @returns {boolean}
     */
    get enabled() {
        return this.#enabled;
    }

    /**
     * Enables or disables shadows
     * @param {boolean} value
     */
    set enabled(value) {
        this.#enabled = value;
    }

    /**
     * Returns the shadowmap options
     * @returns {ShadowMapOptions}
     */
    get map() {
        return this.#map;
    }
}

export class GraphicsOptions {
    #shadow = new ShadowOptions();

    /**
     * Returns the shadow options
     * @returns {ShadowOptions}
     */
    get shadow() {
        return this.#shadow;
    }
}

export class AquanoreOptions {
    #canvas = new CanvasOptions();
    #graphics = new GraphicsOptions();

    /**
     * Returns the canvas options
     * @returns {CanvasOptions}
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * Returns the graphics options
     * @returns {GraphicsOptions}
     */
    get graphics() {
        return this.#graphics;
    }
}