import { Aquanore } from "../aquanore";
import { LightType } from "../enums";
import { PerspectiveCamera } from "./perspective-camera";
import { Light } from "./light";
import { ICamera } from "../interfaces";

export class Scene {
    private static _camera: ICamera;
    private static _lights: Light[];

    static get camera(): ICamera {
        return this._camera;
    }

    static set camera(value: ICamera) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._camera = value;
    }

    static get lights(): Light[] {
        return this._lights;
    }

    static set lights(value: Light[]) {
        if (value == null) {
            throw new Error("Value cannot be null");
        }

        this._lights = value;
    }

    static reset() {
        this._camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.001, 1000);

        this._lights = [];
        this._lights[0] = new Light(LightType.Directional);
    }

    /* INTERNAL FUNCTIONS */
    static __init() {
        this.reset();
    }

    static __update() {
        const cnv = Aquanore.canvas;
        
        if (this._camera instanceof PerspectiveCamera) {
            this._camera.aspect = cnv.width / cnv.height;
        }
    }
}