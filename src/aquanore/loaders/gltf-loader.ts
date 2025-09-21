import { Mesh, Primitive, Model, Texture } from "../graphics";
import { Geometry } from "../graphics/geometries";
import { StandardMaterial } from "../graphics/materials";
import { Joint } from "../graphics/joint";
import { MeshSkin } from "../graphics/mesh-skin";
import { ModelAnimation } from "../graphics/model-animation";
import { ModelAnimationChannel } from "../graphics/model-animation-channel";
import { Matrix4, Quaternion, Vector3 } from "../math";
import { TextureLoader } from "./texture-loader";

type AccessorTypeSize = 1 | 2 | 3 | 4 | 9 | 16;
type ComponentSize = 0 | 1 | 2 | 4;
type ComponentType = 5120 | 5121 | 5122 | 5123 | 5125 | 5126;

export class GltfLoader {
    private _result: Model;
    private _buffers: ArrayBuffer[];
    private _textures: Texture[];

    /**
     * Loads a GLTF model
     * @param {string} path 
     * @returns {Model}
     */
    async load(path: string): Promise<Model> {
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
            const gltf = await res.json();
            await this.parseGltf(gltf, path);
        } else {
            throw new Error(`Failed to load GLTF`);
        }
    }

    private async loadGlb(path: string) {
        const res = await fetch(path);
        const decoder = new TextDecoder();

        let gltf = null;

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            const header = this.loadGlb_ParseHeader(buffer.slice(0, 12));
            const chunks = this.loadGlb_ParseChunks(buffer.slice(12));

            for (let chunk of chunks) {
                if (chunk.type == "JSON") {
                    const json = decoder.decode(chunk.buffer);
                    gltf = JSON.parse(json);
                }

                if (chunk.type == "BIN") {
                    this._buffers.push(chunk.buffer);
                }
            }

            await this.compareVersion(header.version, gltf.asset.version);
            await this.parseGltf(gltf, path);
        } else {
            throw new Error(`Failed to load GLB`);
        }
    }

    private loadGlb_ParseChunks(buffer: ArrayBuffer) {
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
    private async parseGltf(gltf: any, path: string) {
        const scene = gltf.scenes[gltf.scene];

        if (gltf.buffers) {
            for (let obj of gltf.buffers) {
                await this.parseBuffer(gltf, obj, path);
            }
        }

        if (gltf.textures) {
            for (let obj of gltf.textures) {
                await this.parseTexture(gltf, obj, path);
            }
        }

        if (gltf.animations) {
            for (let obj of gltf.animations) {
                await this.parseAnimation(gltf, obj);
            }
        }

        if (gltf.skins) {
            for (let obj of gltf.skins) {
                await this.parseSkin(gltf, obj);
            }
        }

        for (let i = 0; i < scene.nodes.length; i++) {
            const index = scene.nodes[i];
            const node = gltf.nodes[index];

            await this.parseNode(gltf, node, index, null);
        }
    }

    private async parseAnimation(gltf: any, objAnimation: any) {
        const animation = new ModelAnimation();
        animation.name = objAnimation.name;

        for (let objChannel of objAnimation.channels) {
            const objSampler = objAnimation.samplers[objChannel.sampler];

            let inputArray = this.getAccessorBuffer(gltf, objSampler.input);
            let outputArray = this.getAccessorBuffer(gltf, objSampler.output);
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

        this._result.animations.push(animation);
    }

    private async parseTexture(gltf: any, obj: any, path: string) {
        const source = obj.source;
        const objImage = gltf.images[source];

        if (objImage.uri) {
            const folder = this.getFolder(`${path}${objImage.uri}`);
            const filename = this.getFilename(objImage.uri);

            try {
                const loader = new TextureLoader();
                const tex = await loader.load(`${folder}/${filename}`);

                this._textures.push(tex);
            } catch (err) {
                throw new Error(`Failed to load texture from file ${objImage.uri}`);
            }
        }

        if (objImage.bufferView) {
            const buffer = this.getBuffer(gltf, objImage.bufferView);
            const tex = await this.generateTexture(buffer);

            this._textures.push(tex);
        }
    }

    private async parseBuffer(gltf: any, obj: any, path: string) {
        const uri = obj.uri;

        // In case of GLB the buffer is already provided so there wont be a URI property
        if (!uri) {
            return;
        }

        if (uri.startsWith("data:")) {
            const parts = uri.split(";");
            const mimetype = parts[0].replace("data:", "");
            const format = parts[1].split(",")[0];

            if (format == "base64") {
                const res = await fetch(uri);
                const buffer = await res.arrayBuffer();

                this._buffers.push(buffer);
            } else {
                throw new Error(`Failed to parse buffer. Unsupported data URI format ${format}`);
            }
        } else {
            const folder = this.getFolder(`${path}${uri}`);
            const filename = this.getFilename(uri);
            const res = await fetch(`${folder}/${filename}`);

            if (res.ok) {
                const buffer = await res.arrayBuffer();
                this._buffers.push(buffer);
            } else {
                throw new Error(`Failed to load buffer from file. Http response returned ${res.status}.`);
            }
        }
    }

    private async parseNode(gltf: any, obj: any, index: number, parent: number) {
        if ("mesh" in obj) {
            await this.parseMeshNode(gltf, obj, index, parent);
            return;
        }

        await this.parseJointNode(gltf, obj, index, parent);
    }

    private async parseJointNode(gltf: any, obj: any, index: number, parent: number) {
        const joint = new Joint();
        joint.name = obj.name;
        joint.index = index;
        joint.parent = parent;

        if (obj.translation) {
            joint.translation = new Vector3();
            joint.translation.x = obj.translation[0];
            joint.translation.y = obj.translation[1];
            joint.translation.z = obj.translation[2];
        }

        if (obj.scale) {
            joint.scale = new Vector3();
            joint.scale.x = obj.scale[0];
            joint.scale.y = obj.scale[1];
            joint.scale.z = obj.scale[2];
        }

        if (obj.rotation) {
            const q = new Quaternion();
            q.x = obj.rotation[0];
            q.y = obj.rotation[1];
            q.z = obj.rotation[2];
            q.w = obj.rotation[3];

            joint.rotation = Quaternion.toEuler(q);
        }

        if (obj.children != null) {
            joint.children = obj.children;

            for (let i of obj.children) {
                await this.parseNode(gltf, gltf.nodes[i], i, index);
            }
        }

        this._result.joints.push(joint);
    }

    private async parseMeshNode(gltf: any, obj: any, index: number, parent: number) {
        const objMesh = gltf.meshes[obj.mesh];

        // Generate mesh
        const mesh = new Mesh();
        mesh.name = objMesh.name;
        mesh.index = index;
        mesh.parent = parent;

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

        if (obj.skin != null) {
            mesh.skin = obj.skin;
        }

        // Generate primitives
        for (let objPri of objMesh.primitives) {
            const mat = this.generateMaterial(gltf, objPri);
            const geom = this.generateGeometry(gltf, objPri);

            const pri = new Primitive(geom, mat);
            mesh.primitives.push(pri);
        }

        this._result.meshes.push(mesh);
    }

    private async parseSkin(gltf: any, obj: any) {
        const arr = this.getAccessorBuffer(gltf, obj.inverseBindMatrices);

        const skin = new MeshSkin();
        skin.joints = obj.joints;

        for (let i = 0; i < arr.length; i += 16) {
            const values = arr.slice(i, i + 16);
            const matrix = new Matrix4(values);

            skin.matrices.push(matrix);
        }

        this._result.skins.push(skin);
    }

    /* GENERATION FUNCTIONS */
    private generateGeometry(gltf: any, objPri: any) {
        const geom = new Geometry();
        geom.indices = this.getAccessorBuffer(gltf, objPri.indices);
        geom.vertices = this.getAccessorBuffer(gltf, objPri.attributes.POSITION);
        geom.normals = this.getAccessorBuffer(gltf, objPri.attributes.NORMAL);
        geom.uvs = this.getAccessorBuffer(gltf, objPri.attributes.TEXCOORD_0);
        geom.joints = this.getAccessorBuffer(gltf, objPri.attributes.JOINTS_0);
        geom.weights = this.getAccessorBuffer(gltf, objPri.attributes.WEIGHTS_0);

        // Fill up required arrays if the model does not provide the data
        if (geom.normals.length == 0) {
            for (let i = 0; i < geom.vertices.length; i += 3) {
                geom.normals.push(0);
                geom.normals.push(0);
                geom.normals.push(0);
            }
        }

        if (geom.uvs.length == 0) {
            for (let i = 0; i < geom.vertices.length; i += 3) {
                geom.uvs.push(0);
                geom.uvs.push(0);
            }
        }

        geom.generateTangents();
        geom.generateBuffers();

        return geom;
    }

    private generateTexture(buffer: ArrayBuffer): Promise<Texture> {
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

    private generateMaterial(gltf: any, objPri: any): StandardMaterial {
        const mat = new StandardMaterial();

        if (objPri.material != null) {
            const objMat = gltf.materials[objPri.material];
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
        }

        return mat;
    }

    /* ACCESSOR FUNCTIONS */
    /**
     * Returns the total amount of vectors used by the accessor's type.
     * @param {any} gltf - The GLTF object
     * @param {number} accessorIndex - The index of the accessor array of the GLTF object
     * @returns The number of vertices
     */
    private getAccessorTypeSize(gltf: any, accessorIndex: any): AccessorTypeSize {
        const accessor = gltf.accessors[accessorIndex];

        switch (accessor.type) {
            case "SCALAR":
                return 1;

            case "VEC2":
                return 2;

            case "VEC3":
                return 3;

            case "VEC4":
                return 4;

            case "MAT3":
                return 9;

            case "MAT4":
                return 16;

            default:
                throw new Error(`Unknown accessor type ${accessor.type}`);
        }
    }

    /**
     * This function will return the accessor's portion of the associated bufferview's buffer as an array.
     * @param {any} gltf - The GLTF object
     * @param {number} accessorIndex - The index of the accessor array of the GLTF object
     * @returns The accessor's buffer as array
     */
    private getAccessorBuffer(gltf: any, accessorIndex: number): number[] {
        if (accessorIndex == null) {
            return [];
        }

        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const bufferSize = this.getAccessorTotalBytes(gltf, accessorIndex);
        const bufferOffset = this.getAccessorByteOffset(gltf, accessorIndex);
        const byteStride = this.getAccessorByteStride(gltf, accessorIndex);
        const typeSize = this.getAccessorTypeSize(gltf, accessorIndex);

        let buffer = this._buffers[bufferView.buffer];
        buffer = buffer.slice(bufferOffset, bufferOffset + bufferSize);

        if (byteStride > 0) {
            buffer = this.removeStrideFromBuffer(buffer, byteStride, accessor.componentType, typeSize);
        }

        return this.bufferToArray(buffer, accessor.componentType);
    }

    /**
     * Returns the byte offset from the bufferview the accessor points at.
     * @param {any} gltf The GLTF object
     * @param {number} accessorIndex The index of the accessor array of the GLTF object
     * @returns {number}
     */
    private getAccessorByteOffset(gltf: any, accessorIndex: number): number {
        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];

        return (accessor.byteOffset || 0) + (bufferView.byteOffset || 0);
    }

    /**
     * Returns the byte stride from the bufferview the accessor points at.
     * @param {any} gltf The GLTF object
     * @param {number} accessorIndex The index of the accessor array of the GLTF object
     * @returns The accessor's buffer byte stride
     */
    private getAccessorByteStride(gltf: any, accessorIndex: number): number {
        const accessor = gltf.accessors[accessorIndex];
        const bv = gltf.bufferViews[accessor.bufferView];

        return bv.byteStride ?? 0;
    }

    /**
     * Calculates the total number of bytes required for the accessor's `ArrayBuffer` instance.
     * @param {any} gltf The GLTF object
     * @param {number} accessorIndex The index of the accessor array of the GLTF object
     * @returns {number} The size in bytes as number
     */
    private getAccessorTotalBytes(gltf: any, accessorIndex: number): number {
        const accessor = gltf.accessors[accessorIndex];
        const byteStride = this.getAccessorByteStride(gltf, accessorIndex);

        // If there is a stride there is no point of calculating the size based on the accessor's type
        // since the bytes needed for the accessor are part of the bytes the stride covers
        if (byteStride > 0) {
            return accessor.count * byteStride;
        } else {
            const typeSize = this.getAccessorTypeSize(gltf, accessorIndex);
            const byteCount = this.getComponentSize(accessor.componentType);

            return accessor.count * typeSize * byteCount;
        }
    }

    /* BUFFER FUNCTIONS */
    /**
    * Returns the total amount of bytes used for a number encoded using the given component type.
    * @param {number} componentType 
    * @returns The total amount of bytes
    */
    private getComponentSize(componentType: number): ComponentSize {
        // Bytes and unsigned bytes both take.. 1 byte per.. byte.. obviously.
        if (componentType == 5120 || componentType == 5121) {
            return 1;
        }

        // Shorts and unsigned shorts and are both 16-bit integers so they use 2 bytes.
        if (componentType == 5122 || componentType == 5123) {
            return 2;
        }

        // Integers and floats both use 4 bytes.
        if (componentType == 5125 || componentType == 5126) {
            return 4;
        }

        return 0;
    }

    /**
     * Removes the stride from the buffer so the buffer data becomes as closely packed as possible.
     * @param {ArrayBuffer} buffer - The instance of `ArrayBuffer`
     * @param {number} byteStride - The byte stride of the buffer
     * @param {ComponentType} componentType - The buffer's component type. This refers to the allowed GLTF component types.
     * @param {AccessorTypeSize} accessorTypeSize - The accessor type size. For example a `VEC3` has a size of 3 because it consists of 3 vertices.
     * @returns The buffer without stride.
     */
    private removeStrideFromBuffer(buffer: ArrayBuffer, byteStride: number, componentType: ComponentType, accessorTypeSize: AccessorTypeSize): ArrayBuffer {
        let byteCount = this.getComponentSize(componentType) * accessorTypeSize;
        let total = (buffer.byteLength / byteStride) * byteCount;
        let result = new Uint8Array(total);

        for (let i = 0; i < buffer.byteLength; i += byteStride) {
            for (let j = 0; j < byteCount; j++) {
                const chunk = buffer.slice(i, i + byteCount);
                const chunkArray = new Uint8Array(chunk);

                result[(i / byteStride) * byteCount + j] = chunkArray[j];
            }
        }

        return result.buffer;
    }

    /**
     * Converts an instance of type `ArrayBuffer` to a typed array based on the provided component type.
     * @param {ArrayBuffer} buffer - The instance of the `ArrayBuffer`
     * @param {number} componentType - The component type of the buffer
     * @returns An array
     */
    private bufferToArray(buffer: ArrayBuffer, componentType: ComponentType) {
        // BYTE
        if (componentType == 5120) {
            return Array.from(new Int8Array(buffer));
        }

        // UNSIGNED_BYTE
        if (componentType == 5121) {
            return Array.from(new Uint8Array(buffer));
        }

        // SHORT
        if (componentType == 5122) {
            return Array.from(new Int16Array(buffer));
        }

        // UNSIGNED_SHORT
        if (componentType == 5123) {
            return Array.from(new Uint16Array(buffer));
        }

        // UNSIGNED INT
        if (componentType == 5125) {
            return Array.from(new Uint32Array(buffer));
        }

        // FLOAT
        if (componentType == 5126) {
            return Array.from(new Float32Array(buffer));
        }

        throw new Error(`Unsupported component type ${componentType}`);
    }

    private getBuffer(gltf: any, bufferViewIndex: number): ArrayBuffer {
        const bufferView = gltf.bufferViews[bufferViewIndex];

        let offset = bufferView.byteOffset || 0;
        let length = bufferView.byteLength;
        let buffer = this._buffers[bufferView.buffer];
        buffer = buffer.slice(offset, offset + length);

        return buffer;
    }

    /* IO FUNCTIONS */
    private getFolder(path: string): string {
        let folder = path.replace("\\", "/");
        folder = folder.substring(0, folder.lastIndexOf("/") + 1);

        return folder;
    }

    private getFilename(path: string): string {
        let filename = path.replace("\\", "/");
        filename = filename.substring(filename.lastIndexOf("/") + 1);

        return filename;
    }
}