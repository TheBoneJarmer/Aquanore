/* GLTF */
export type GltfScalar = [number];
export type GltfVector = [number, number, number];
export type GltfQuaternion = [number, number, number, number];
export type GltfMatrix = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export type GltfAccessorType = "VEC2" | "VEC3" | "SCALAR";

export type GltfAsset = {
    generator: string;
    version: string;
};

export type GltfScene = {
    name: string;
    nodes: number[];
};

export type GltfNode = {
    name: string;
    translation: GltfVector;
    rotation: GltfQuaternion;
    scale: GltfVector;
    matrix: GltfMatrix;
    children: GltfNode[];
};

export type GltfMeshNode = GltfNode & {
    mesh: number;
};

export type GltfCameraNode = GltfNode & {
    camera: number;
};

export type GltfSkinNode = GltfNode & {
    skin: number;
};

export type GltfColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type GltfPbrMetallicRoughness = {
    baseColorFactor: GltfColor[];
    metallicFactor: number;
    roughnessFactor: number;
};

export type GltfMaterial = {
    doubleSided: boolean;
    name: string;
    pbrMetallicRoughness: GltfPbrMetallicRoughness;
};

export type GltfAttributes = {
    POSITION: number;
    NORMAL: number;
    TEXCOORD_0: number;
};

export type GltfPrimitive = {
    attributes: GltfAttributes;
    indices: number;
    material: number;
};

export type GltfMesh = {
    name: string;
    primitives: GltfPrimitive[];
};

export type GltfAccessor = {
    bufferView: number;
    componentType: number;
    count: number;
    max: GltfScalar | GltfVector | GltfQuaternion;
    min: GltfScalar | GltfVector | GltfQuaternion;
    type: GltfAccessorType;
    byteOffset: number;
};

export type GltfBufferView = {
    buffer: number;
    byteLength: number;
    byteOffset: number;
    target: number;
};

export type GltfBuffer = {
    byteLength: number;
    uri: string;
};

export type Gltf = {
    asset: GltfAsset;
    scene: number,
    scenes: GltfScene[];
    nodes: GltfNode[];
    materials: GltfMaterial[];
    meshes: GltfMesh[];
    accessors: GltfAccessor[];
    bufferViews: GltfBufferView[];
    buffers: GltfBuffer[];
};