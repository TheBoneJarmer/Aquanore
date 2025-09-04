import { Aquanore } from "../aquanore";
import { Mesh, MeshPrimitive, Model, Texture } from "../graphics";
import { RawGeometry } from "../graphics/geometries";
import { StandardMaterial } from "../graphics/materials";
import { MeshGroup } from "../graphics/mesh-group";
import { ModelAnimation } from "../graphics/model-animation";
import { ModelAnimationChannel } from "../graphics/model-animation-channel";
import { Quaternion, Vector3 } from "../math";
import { TextureLoader } from "./texture-loader";

export class GltfLoader {
    #result = null;
    #buffers = [];
    #textures = [];

    async load(path) {
        this.#result = new Model();
        this.#buffers = [];
        this.#textures = [];

        if (path.endsWith(".gltf")) {
            await this.#loadGltf(path);
        } else if (path.endsWith(".glb")) {
            await this.#loadGlb(path);
        } else {
            throw new Error("Unsupported model format");
        }

        return this.#result;
    }

    /* IMPORT */
    async #loadGltf(path) {
        const res = await fetch(path);

        if (res.ok) {
            const gltf = await res.json();
            await this.#parseGltf(gltf);
        } else {
            throw new Error(`Failed to load GLTF`);
        }
    }

    async #loadGlb(path) {
        const res = await fetch(path);
        const decoder = new TextDecoder();

        let gltf = null;

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            const header = this.#loadGlb_ParseHeader(buffer.slice(0, 12));
            const chunks = this.#loadGlb_ParseChunks(header, buffer.slice(12));

            for (let chunk of chunks) {
                if (chunk.type == "JSON") {
                    const json = decoder.decode(chunk.buffer);
                    gltf = JSON.parse(json);
                    console.log(gltf);
                }

                if (chunk.type == "BIN") {
                    this.#buffers.push(chunk.buffer);
                }
            }

            await this.#compareVersion(header.version, gltf.asset.version);
            await this.#parseGltf(gltf);
        } else {
            throw new Error(`Failed to load GLB`);
        }
    }

    #loadGlb_ParseChunks(header, buffer) {
        const decoder = new TextDecoder();

        let result = [];
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

    #loadGlb_ParseHeader(buffer) {
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

    async #compareVersion(version1, version2) {
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
    async #parseGltf(gltf) {
        const scene = gltf.scenes[gltf.scene];

        if (gltf.buffers) {
            for (let obj of gltf.buffers) {
                await this.#parseBuffer(obj);
            }
        }

        if (gltf.textures) {
            for (let obj of gltf.textures) {
                await this.#parseTexture(gltf, obj);
            }
        }

        if (gltf.animations) {
            for (let obj of gltf.animations) {
                await this.#parseAnimation(gltf, obj);
            }
        }

        if (scene.nodes.length == 1) {
            const nodeIndex = scene.nodes[0];
            const node = gltf.nodes[nodeIndex];
            const data = await this.#parseNode(gltf, node, nodeIndex);

            this.#result.data = data;
        }

        if (scene.nodes.length > 1) {
            this.#result.data = [];

            for (let i = 0; i < scene.nodes.length; i++) {
                const node = gltf.nodes[i];
                const data = await this.#parseNode(gltf, node, i);

                this.#result.data.push(data);
            }
        }
    }

    async #parseAnimation(gltf, objAnimation) {
        const animation = new ModelAnimation();
        animation.name = objAnimation.name;

        for (let objChannel of objAnimation.channels) {
            const objSampler = objAnimation.samplers[objChannel.sampler];

            let inputArray = this.#getAccessorBuffer(gltf, objSampler.input);
            let outputArray = this.#getAccessorBuffer(gltf, objSampler.output);
            let output = []; // Vectors or quaternions

            // Convert the output array to either vector3 or quaternion
            if (objChannel.target.path == "translation" || objChannel.target.path == "scale") {
                for (let i = 0; i < outputArray.length; i += 3) {
                    const v = new Vector3();
                    v.x = outputArray[i + 0];
                    v.y = outputArray[i + 1];
                    v.z = outputArray[i + 2];

                    output.push(v);
                }
            }

            if (objChannel.target.path == "rotation") {
                for (let i = 0; i < outputArray.length; i += 4) {
                    const q = new Quaternion();
                    q.x = outputArray[i + 0];
                    q.y = outputArray[i + 1];
                    q.z = outputArray[i + 2];
                    q.w = outputArray[i + 3];

                    output.push(q);
                }
            }

            // Finally generate our animation channel and add it to the list
            const channel = new ModelAnimationChannel();
            channel.index = objChannel.target.node;
            channel.path = objChannel.target.path;
            channel.interpolation = objSampler.interpolation;
            channel.input = inputArray;
            channel.output = output;

            animation.channels.push(channel);
        }

        this.#result.animations.push(animation);
    }

    async #parseTexture(gltf, objTex) {
        const source = objTex.source;
        const objImage = gltf.images[source];

        if (objImage.uri) {
            try {
                const loader = new TextureLoader();
                const tex = await loader.load(objImage.uri);

                this.#textures.push(tex);
            } catch (err) {
                throw new Error(`Failed to load texture from file ${objImage.uri}`);
            }
        }

        if (objImage.bufferView) {
            const buffer = this.#getBuffer(gltf, objImage.bufferView);
            const tex = await this.#getTexture(buffer);

            this.#textures.push(tex);
        }
    }

    async #parseBuffer(objBuffer) {
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
                this.#buffers.push(buffer);
            } else {
                throw new Error(`Failed to load buffer from file. Http response returned ${res.status}.`);
            }
        }
    }

    async #parseNode(gltf, obj, index) {
        if ("mesh" in obj) {
            return await this.#parseMesh(gltf, obj, index);
        }

        return await this.#parseMeshGroup(gltf, obj, index);
    }

    async #parseMeshGroup(gltf, obj, index) {
        const group = new MeshGroup();
        group.name = obj.name;
        group.index = index;

        if (obj.translation) {
            group.translation = new Vector3();
            group.translation.x = obj.translation[0];
            group.translation.y = obj.translation[1];
            group.translation.z = obj.translation[2];
        }

        if (obj.scale) {
            group.scale = new Vector3();
            group.scale.x = obj.scale[0];
            group.scale.y = obj.scale[1];
            group.scale.z = obj.scale[2];
        }

        if (obj.rotation) {
            const q = new Quaternion();
            q.x = obj.rotation[0];
            q.y = obj.rotation[1];
            q.z = obj.rotation[2];
            q.w = obj.rotation[3];

            group.rotation = Quaternion.toEuler(q);
        }

        if (obj.children) {
            for (let index of obj.children) {
                const child = await this.#parseNode(gltf, gltf.nodes[index], index);
                group.children.push(child);
            }
        }

        return group;
    }

    async #parseMesh(gltf, obj, index) {
        const objMesh = gltf.meshes[obj.mesh];

        // Generate mesh
        const mesh = new Mesh();
        mesh.name = objMesh.name;
        mesh.index = index;

        if (obj.translation) {
            mesh.translation = new Vector3();
            mesh.translation.x = obj.translation[0];
            mesh.translation.y = obj.translation[1];
            mesh.translation.z = obj.translation[2];
        }

        if (obj.scale) {
            mesh.scale = new Vector3();
            mesh.scale.x = obj.scale[0];
            mesh.scale.y = obj.scale[1];
            mesh.scale.z = obj.scale[2];
        }

        if (obj.rotation) {
            const q = new Quaternion();
            q.x = obj.rotation[0];
            q.y = obj.rotation[1];
            q.z = obj.rotation[2];
            q.w = obj.rotation[3];

            mesh.rotation = Quaternion.toEuler(q);
        }

        // Generate primitives
        for (let objPri of objMesh.primitives) {
            const vertices = this.#getAccessorBuffer(gltf, objPri.attributes.POSITION);
            const normals = this.#getAccessorBuffer(gltf, objPri.attributes.NORMAL);
            const uvs = this.#getAccessorBuffer(gltf, objPri.attributes.TEXCOORD_0);
            const indices = this.#getAccessorBuffer(gltf, objPri.indices);

            const mat = this.#getMaterial(gltf, objPri);
            const geom = new RawGeometry(vertices, normals, uvs, indices);
            const pri = new MeshPrimitive(geom, mat);

            mesh.primitives.push(pri);
        }

        return mesh;
    }

    /* HELPER FUNCTIONS */
    #getTexture(buffer) {
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

    #getMaterial(gltf, pri) {
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

                mat.colorMap = this.#textures[objTex.source];
            }
        }

        return mat;
    }

    #getAccessorBuffer(gltf, accesorIndex) {
        const gl = Aquanore.ctx;
        const accesor = gltf.accessors[accesorIndex];
        const bufferView = gltf.bufferViews[accesor.bufferView];

        const offset = accesor.byteOffset ?? 0 + bufferView.byteOffset;
        const length = bufferView.byteLength;
        const buffer = this.#buffers[bufferView.buffer].slice(offset, offset + length);

        if (accesor.componentType == gl.FLOAT) {
            return Array.from(new Float32Array(buffer));
        }

        if (accesor.componentType == gl.UNSIGNED_SHORT) {
            return Array.from(new Uint16Array(buffer));
        }

        return [];
    }

    #getBuffer(gltf, index) {
        const bufferView = gltf.bufferViews[index];
        const offset = bufferView.byteOffset;
        const length = bufferView.byteLength;

        return this.#buffers[bufferView.buffer].slice(offset, offset + length);
    }
}