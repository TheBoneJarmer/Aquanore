/**
 * A class representing the canvas options.
 */
export class CanvasOptions {
    /**
     * The HTML canvas element used by Aquanore to render to. By default a canvas element will be generated the size of the entire inner window.
     */
    dom: HTMLCanvasElement | null = null;

    /**
     * Automatically resizes the canvas to fill up the entire inner window. Set to false if you wish to set the canvas dimensions manually.
     */
    autoResize: boolean = true;
}

/**
 * A class representing the shadow frustrum options. The values are used to create a ortho matrix used by the shadow map.
 */
export class ShadowFrustrumOptions {
    /**
     * Left plane
     */
    left: number = -16;

    /**
     * Right plane
     */
    right: number = 16;

    /**
     * Top plane
     */
    top: number = 16;

    /**
     * Bottom plane
     */
    bottom: number = -16;

    /**
     * Near plane
     */
    near: number = -16;

    /**
     * Far plane
     */
    far: number = 16;
}

/**
 * A class representing the shadow map options. These are used to generate the texture to which the framebuffer renders its shadowmap to.
 */
export class ShadowMapOptions {
    /**
     * The shadowmap width
     */
    width: number = 4096;

    /**
     * The shadowmap height
     */
    height: number = 4096;
}

/**
 * A class representing the shadow options.
 */
export class ShadowOptions {
    /**
     * This setting know what it is. It can speak for itself. It ain't not no bitch.
     */
    enabled: boolean = true;

    /**
     * The shadow frustrum options
     */
    frustrum: ShadowFrustrumOptions = new ShadowFrustrumOptions();

    /**
     * The shadowmap options
     */
    map: ShadowMapOptions = new ShadowMapOptions();
}

/**
 * A class representing all of Aquanore's default settings.
 */
export class AquanoreOptions {
    /**
     * The canvas options
     */
    canvas: CanvasOptions = new CanvasOptions();

    /**
     * The shadow options
     */
    shadow: ShadowOptions = new ShadowOptions();
}