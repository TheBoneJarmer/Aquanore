import { Gltf, GltfBuffer, GltfMaterial, GltfMeshNode, GltfNode, GltfPrimitive } from "../types";
import { ILoader, IMaterial } from "../interfaces";
import { Mesh, MeshPrimitive, Model } from "../graphics";
import { Aquanore } from "../aquanore";
import { RawIndexGeometry } from "../graphics/geometries";
import { StandardMaterial } from "../graphics/materials";

export class GltfLoader implements ILoader<Model> {
    private _result: Model;
    private _gltf: Gltf;
    private _buffers: ArrayBuffer[];

    public async load(path: string): Promise<Model> {
        this._result = new Model();
        this._buffers = [];

        if (path.endsWith(".gltf")) {
            await this.loadGltf(path);
        } else if (path.endsWith(".glb")) {
            await this.loadGlb(path);
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

        for (let b of this._gltf.buffers) {
            await this.parseBuffer(b);
        }

        for (let n of scene.nodes) {
            const node = this._gltf.nodes[n];

            await this.traverseNode(node);
        }
    }

    private async parseBuffer(obj: GltfBuffer) {
        const uri = obj.uri;

        if (uri.startsWith("data:")) {
            // TODO: Parse uri data
        } else {
            const res = await fetch(uri);

            if (res.ok) {
                const buffer = await res.arrayBuffer();
                this._buffers.push(buffer);
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
        const objMesh = this._gltf.meshes[node.mesh];
        const mesh = new Mesh();

        for (let objPri of objMesh.primitives) {
            const vertices = this.getBufferArray(objPri.attributes.POSITION);
            const normals = this.getBufferArray(objPri.attributes.NORMAL);
            const uvs = this.getBufferArray(objPri.attributes.TEXCOORD_0);
            const indices = this.getBufferArray(objPri.indices);

            const mat = this.getMaterial(objPri);
            const geom = new RawIndexGeometry(vertices, normals, uvs, indices);
            const pri = new MeshPrimitive(geom ,mat);

            mesh.primitives.push(pri);
        }

        this._result.meshes.push(mesh);
    }

    /* HELPER FUNCTIONS */
    private getMaterial(pri: GltfPrimitive): IMaterial {
        const objMat = this._gltf.materials[pri.material];

        const mat = new StandardMaterial();
        mat.color.r = Math.round(objMat.pbrMetallicRoughness.baseColorFactor[0] * 255);
        mat.color.g = Math.round(objMat.pbrMetallicRoughness.baseColorFactor[1] * 255);
        mat.color.b = Math.round(objMat.pbrMetallicRoughness.baseColorFactor[2] * 255);
        
        return mat;
    }

    private getBufferArray(accesorIndex: number): number[] {
        const gl = Aquanore.ctx;
        const accesor = this._gltf.accessors[accesorIndex];
        const bufferView = this._gltf.bufferViews[accesor.bufferView];

        const offset = accesor.byteOffset ?? 0 + bufferView.byteOffset;
        const length = bufferView.byteLength;
        const buffer = this._buffers[bufferView.buffer].slice(offset, offset + length);

        if (accesor.componentType == gl.FLOAT) {
            return Array.from(new Float32Array(buffer));
        }
        
        if (accesor.componentType == gl.UNSIGNED_SHORT) {
            return Array.from(new Uint16Array(buffer));
        }

        return [];
    }

    private getBuffer(accesorIndex: number): ArrayBuffer {
        const accesor = this._gltf.accessors[accesorIndex];
        const bufferView = this._gltf.bufferViews[accesor.bufferView];

        const offset = accesor.byteOffset ?? 0 + bufferView.byteOffset;
        const length = bufferView.byteLength;

        return this._buffers[bufferView.buffer].slice(offset, offset + length);
    }
}