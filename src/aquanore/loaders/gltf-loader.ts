import { Gltf, GltfBuffer, GltfMeshNode, GltfNode } from "../types";
import { ILoader } from "../interfaces";
import { Model } from "../graphics";

export class GltfLoader implements ILoader<Model> {
    private _result: Model;
    private _gltf: Gltf;
    private _buffers: Blob[];

    public async load(path: string): Promise<Model> {
        this._result = new Model();
        this._buffers = [];

        if (path.endsWith(".gltf")) {
            this.loadGltf(path);
        } else if (path.endsWith(".glb")) {
            this.loadGlb(path);
        } else {
            throw new Error("Unsupported model format");
        }

        return this._result;
    }

    /* IMPORT */
    private async loadGltf(path: string) {
        const res = await fetch(path);

        if (res.ok) {
            const json = await res.json();
            this._gltf = json as Gltf;

            await this.parse();
        } else {
            throw new Error(`Failed to load GLTF`);
        }
    }

    private async loadGlb(path: string) {
        const res = await fetch(path);

        if (res.ok) {

        } else {
            throw new Error(`Failed to load GLB`);
        }
    }

    /* PARSE */
    private async parse() {
        const scene = this._gltf.scenes[this._gltf.scene];

        for (let n of scene.nodes) {
            const node = this._gltf.nodes[n];

            await this.traverseNode(node);
        }

        for (let b of this._gltf.buffers) {
            await this.parseBuffer(b);
        }
    }

    private async parseBuffer(obj: GltfBuffer) {
        const uri = obj.uri;

        if (uri.startsWith("data:")) {
            // TODO: Parse uri data
        } else {
            const res = await fetch(uri);

            if (res.ok) {
                const blob = await res.blob();
                this._buffers.push(blob);

                
            } else {
                throw new Error("Failed to load buffer from file");
            }
        }
    }

    private async traverseNode(node: GltfNode) {
        await this.parseNode(node);

        if (!node.children) {
            return;
        }

        for (let child of node.children) {
            await this.traverseNode(child);
        }
    }

    private async parseNode(node: GltfNode) {
        if ("mesh" in node) {
            await this.parseMeshNode(node as GltfMeshNode);
        }
    }

    private async parseMeshNode(node: GltfMeshNode) {
        const obj = this._gltf.meshes[node.mesh];

        for (let primitive of obj.primitives) {
            const vertices: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];
            const indices: number[] = [];

            const accVertices = this._gltf.accessors[primitive.attributes.POSITION];
            const accNormal = this._gltf.accessors[primitive.attributes.NORMAL];
            const accUvs = this._gltf.accessors[primitive.attributes.TEXCOORD_0];
            const accIndices = this._gltf.accessors[primitive.indices];
        }
    }

    /* HELPER FUNCTIONS */
}