export class CanvasOptions {
    dom: HTMLCanvasElement = null;
    autoResize: boolean = true;
}

export class ShadowFrustrumOptions {
    left: number = -16;
    right: number = 16;
    top: number = 16;
    bottom: number = -16;
    near: number = -16;
    far: number = 16;
}

export class ShadowMapOptions {
    width: number = 4096;
    height: number = 4096;
}

export class ShadowOptions {
    enabled: boolean = true;
    frustrum: ShadowFrustrumOptions = new ShadowFrustrumOptions();
    map: ShadowMapOptions = new ShadowMapOptions();
}

export class AquanoreOptions {
    canvas: CanvasOptions = new CanvasOptions();
    shadow: ShadowOptions = new ShadowOptions();
}