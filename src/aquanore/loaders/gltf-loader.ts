import { Gltf, GltfBuffer, GltfMaterial, GltfMeshNode, GltfNode, GltfPrimitive, GltfTexture } from "../types";
import { ILoader, IMaterial } from "../interfaces";
import { Mesh, MeshPrimitive, Model, Texture } from "../graphics";
import { Aquanore } from "../aquanore";
import { RawIndexGeometry } from "../graphics/geometries";
import { StandardMaterial } from "../graphics/materials";
import { TextureLoader } from "./texture-loader";

export class GltfLoader implements ILoader<Model> {
    private _result: Model;
    private _buffers: ArrayBuffer[];
    private _textures: Texture[];

    public async load(path: string): Promise<Model> {
        this._result = new Model();
        this._buffers = [];
        this._textures = [];

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
            const gltf = json as Gltf;

            await this.parseGltf(gltf);
        } else {
            throw new Error(`Failed to load GLTF`);
        }
    }

    private async loadGlb(path: string) {
        const res = await fetch(path);
        const decoder = new TextDecoder();

        let gltf: Gltf = null;

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            const header = this.loadGlb_ParseHeader(buffer.slice(0, 12));
            const chunks = this.loadGlb_ParseChunks(header, buffer.slice(12));

            for (let chunk of chunks) {
                if (chunk.type == "JSON") {
                    const json = decoder.decode(chunk.buffer);
                    gltf = JSON.parse(json) as Gltf;

                    console.log(gltf);
                }

                if (chunk.type == "BIN") {
                    this._buffers.push(chunk.buffer);
                }
            }

            await this.compareVersion(header.version, gltf.asset.version);
            await this.parseGltf(gltf);
        } else {
            throw new Error(`Failed to load GLB`);
        }
    }

    private loadGlb_ParseChunks(header: any, buffer: ArrayBuffer) {
        const decoder = new TextDecoder();

        let result: any[] = [];
        let index = 0;

        while (index < buffer.byteLength) {
            const chunkLength = new Int32Array(buffer.slice(index, index + 4));
            const chunkType = decoder.decode(buffer.slice(index + 4, index + 8));
            const chunk = buffer.slice(index + 8, index + 8 + chunkLength[0]);

            result.push({
                type: chunkType.replace("\0", ""),
                buffer: chunk
            });

            index += 8 + chunkLength[0];
        }

        return result;
    }

    private loadGlb_ParseHeader(buffer: ArrayBuffer) {
        const decoder = new TextDecoder();
        const magic = decoder.decode(buffer.slice(0, 4));
        const version = new Int8Array(buffer.slice(4, 8));
        const length = new Int32Array(buffer.slice(8, 12));

        if (magic !== "glTF") {
            throw new Error("Incorrect format");
        }

        return {
            version: version.join("."),
            length: length[0]
        }
    }

    private async compareVersion(version1: string, version2: string) {
        const values1 = version1.split(".").map(x => parseInt(x));
        const values2 = version2.split(".").map(x => parseInt(x));

        const major1 = values1[0] ?? 0;
        const minor1 = values1[1] ?? 0;
        const patch1 = values1[2] ?? 0;
        const meta1 = values1[3] ?? 0;

        const major2 = values2[0] ?? 0;
        const minor2 = values2[1] ?? 0;
        const patch2 = values2[2] ?? 0;
        const meta2 = values2[3] ?? 0;

        if (major1 != major2 || minor1 != minor2 || patch1 != patch2 || meta1 != meta2) {
            throw new Error("Version mismatch");
        }
    }

    /* PARSE */
    private async parseGltf(gltf: Gltf) {
        const scene = gltf.scenes[gltf.scene];

        if (gltf.buffers) {
            for (let b of gltf.buffers) {
                await this.parseBuffer(b);
            }
        }

        if (gltf.textures) {
            for (let t of gltf.textures) {
                await this.parseTexture(gltf, t);
            }
        }

        for (let n of scene.nodes) {
            const node = gltf.nodes[n];
            await this.traverseNode(gltf, node);
        }
    }

    private async parseTexture(gltf: Gltf, objTex: GltfTexture) {
        const source = objTex.source;
        const objImage = gltf.images[source];

        if (objImage.uri) {
            try {
                const loader = new TextureLoader();
                const tex = await loader.load(objImage.uri);

                this._textures.push(tex);
            } catch (err) {
                throw new Error(`Failed to load texture from file ${objImage.uri}`);
            }
        }

        if (objImage.bufferView) {
            const buffer = this.getBuffer(gltf, objImage.bufferView);
            const tex = await this.getTexture(buffer);

            this._textures.push(tex);
        }
    }

    private async parseBuffer(objBuffer: GltfBuffer) {
        const uri = objBuffer.uri;

        // In case of GLB the buffer is already provided so there wont be a URI property
        if (!uri) {
            return;
        }

        if (uri.startsWith("data:")) {
            // TODO: Parse uri data
            throw new Error("Data urls are not yet supported.");
        } else {
            const res = await fetch(uri);

            if (res.ok) {
                const buffer = await res.arrayBuffer();
                this._buffers.push(buffer);
            } else {
                throw new Error(`Failed to load buffer from file. Http response returned ${res.status}.`);
            }
        }
    }

    private async traverseNode(gltf: Gltf, node: GltfNode) {
        await this.parseNode(gltf, node);

        if (!node.children) {
            return;
        }

        for (let index of node.children) {
            let child = gltf.nodes[index];
            await this.traverseNode(gltf, child);
        }
    }

    private async parseNode(gltf: Gltf, node: GltfNode) {
        if ("mesh" in node) {
            await this.parseMeshNode(gltf, node as GltfMeshNode);
        }
    }

    private async parseMeshNode(gltf: Gltf, node: GltfMeshNode) {
        const objMesh = gltf.meshes[node.mesh];
        const mesh = new Mesh();

        for (let objPri of objMesh.primitives) {
            const vertices = this.getAccessorBuffer(gltf, objPri.attributes.POSITION);
            const normals = this.getAccessorBuffer(gltf, objPri.attributes.NORMAL);
            const uvs = this.getAccessorBuffer(gltf, objPri.attributes.TEXCOORD_0);
            const indices = this.getAccessorBuffer(gltf, objPri.indices);

            const mat = this.getMaterial(gltf, objPri);
            const geom = new RawIndexGeometry(vertices, normals, uvs, indices);
            const pri = new MeshPrimitive(geom, mat);

            mesh.primitives.push(pri);
        }

        this._result.meshes.push(mesh);
    }

    /* HELPER FUNCTIONS */
    private getTexture(buffer: ArrayBuffer): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);

            const img = new Image();
            img.src = url;
            img.onload = () => {
                const tex = new Texture(img.width, img.height, img);
                URL.revokeObjectURL(url);
                resolve(tex);
            };

            img.onerror = (err) => {
                reject(err);
            };
        });
    }

    private getMaterial(gltf: Gltf, pri: GltfPrimitive): IMaterial {
        const mat = new StandardMaterial();
        const objMat = gltf.materials[pri.material];
        const objPbr = objMat.pbrMetallicRoughness;

        if (objPbr) {
            if (objPbr.baseColorFactor) {
                mat.color.r = Math.round(objPbr.baseColorFactor[0] * 255);
                mat.color.g = Math.round(objPbr.baseColorFactor[1] * 255);
                mat.color.b = Math.round(objPbr.baseColorFactor[2] * 255);
            }

            if (objPbr.baseColorTexture) {
                const index = objPbr.baseColorTexture.index;
                const objTex = gltf.textures[index];

                mat.colorMap = this._textures[objTex.source];
            }
        }

        return mat;
    }

    private getAccessorBuffer(gltf: Gltf, accesorIndex: number): number[] {
        const gl = Aquanore.ctx;
        const accesor = gltf.accessors[accesorIndex];
        const bufferView = gltf.bufferViews[accesor.bufferView];

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

    private getBuffer(gltf: Gltf, index: number): ArrayBuffer {
        const bufferView = gltf.bufferViews[index];
        const offset = bufferView.byteOffset;
        const length = bufferView.byteLength;

        return this._buffers[bufferView.buffer].slice(offset, offset + length);
    }
}