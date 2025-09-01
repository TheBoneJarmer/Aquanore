import { Model } from "../graphics";

export class GltfLoader {
    load(path: string): Promise<Model>;
}