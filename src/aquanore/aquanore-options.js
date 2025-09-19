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

export class ShadowFrustrumOptions {
    #left = -16;
    #right = 16;
    #top = 16;
    #bottom = -16;
    #near = -16;
    #far = 16;

    /**
     * Returns the left value of the shadow frustum
     * @returns {number}
     */
    get left() {
        return this.#left;
    }

    /**
     * Sets the left value of the shadow frustum
     * @param {number} value
     */
    set left(value) {
        this.#left = value;
    }

    /**
     * Returns the right value of the shadow frustum
     * @returns {number}
     */
    get right() {
        return this.#right;
    }

    /**
     * Sets the right value of the shadow frustum
     * @param {number} value
     */
    set right(value) {
        this.#right = value;
    }

    /**
     * Returns the top value of the shadow frustum
     * @returns {number}
     */
    get top() {
        return this.#top;
    }

    /**
     * Sets the top value of the shadow frustum
     * @param {number} value
     */
    set top(value) {
        this.#top = value;
    }

    /**
     * Returns the bottom value of the shadow frustum
     * @returns {number}
     */
    get bottom() {
        return this.#bottom;
    }

    /**
     * Sets the bottom value of the shadow frustum
     * @param {number} value
     */
    set bottom(value) {
        this.#bottom = value;
    }

    /**
     * Returns the near value of the shadow frustum
     * @returns {number}
     */
    get near() {
        return this.#near;
    }

    /**
     * Sets the near value of the shadow frustum
     * @param {number} value
     */
    set near(value) {
        this.#near = value;
    }

    /**
     * Returns the far value of the shadow frustum
     * @returns {number}
     */
    get far() {
        return this.#far;
    }

    /**
     * Sets the far value of the shadow frustum
     * @param {number} value
     */
    set far(value) {
        this.#far = value;
    }
}

export class ShadowMapOptions {
    #width = 2048;
    #height = 2048;

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
}

export class ShadowOptions {
    #enabled = true;
    #map = new ShadowMapOptions();
    #frustrum = new ShadowFrustrumOptions();

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

    /**
     * Returns the shadow frustum options
     * @returns {ShadowFrustrumOptions}
     */
    get frustrum() {
        return this.#frustrum;
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