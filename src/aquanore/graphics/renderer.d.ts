import { Vector2, Vector3 } from "../math";
import { Camera } from "./camera";
import { Color } from "./color";
import { Light } from "./light";
import { Model } from "./model";
import { Polygon } from "./polygon";
import { Shader } from "./shaders";
import { Sprite } from "./sprite";
import { Texture } from "./texture";

export class Renderer {
    static set shaderPolygon(value: Shader);
    static set shaderModel(value: Shader);

    static reset(): void;
    static switchShader(shader: Shader): void;
    static drawSprite(sprite: Sprite, pos: Vector2, scale: Vector2, origin: Vector2, frameHor: number, frameVert: number, angle: number, flipHor: boolean, flipVert: boolean, color: Color): void;
    static drawPolygon(polygon: Polygon, pos: Vector2, scale: Vector2, origin: Vector2, angle: number, color: Color, texture?: Texture, textureOffset?: Vector2, flipTextureHor?: boolean, flipTextureVert?: boolean): void;  
    static drawModel(model: Model, camera: Camera, lights: Light[], pos: Vector3, rot: Vector3, scale: Vector3): void;
}