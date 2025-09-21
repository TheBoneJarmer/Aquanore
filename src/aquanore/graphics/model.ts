import { BoxGeometry, CapsuleGeometry, ConeGeometry, CubeGeometry, CylinderGeometry, RingGeometry, SphereGeometry, TorusGeometry, TorusKnotGeometry } from "./geometries";
import { Joint } from "./joint";
import { StandardMaterial } from "./materials";
import { Mesh } from "./mesh";
import { MeshSkin } from "./mesh-skin";
import { ModelAnimation } from "./model-animation";
import { Primitive } from "./primitive";

export class Model {
    private _meshes: Mesh[];
    private _joints: Joint[];
    private _animations: ModelAnimation[];
    private _skins: MeshSkin[];

    get meshes(): Mesh[] {
        return this._meshes;
    }

    set meshes(value: Mesh[]) {
        this._meshes = value;
    }

    get joints(): Joint[] {
        return this._joints;
    }

    set joints(value: Joint[]) {
        this._joints = value;
    }

    get animations(): ModelAnimation[] {
        return this._animations;
    }

    set animations(value: ModelAnimation[]) {
        this._animations = value;
    }

    get skins(): MeshSkin[] {
        return this._skins;
    }

    set skins(value: MeshSkin[]) {
        this._skins = value;
    }

    constructor() {
        this._meshes = [];
        this._joints = [];
        this._animations = [];
        this._skins = [];
    }

    /* FACTORY FUNCTIONS */
    static cube(size: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1): Model {
        const geom = new CubeGeometry(size, widthSegments, heightSegments, depthSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Cube";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static box(width: number = 1, height: number = 1, depth: number = 1, widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1): Model {
        const geom = new BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Box";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static capsule(radius: number = 1, height: number = 1, capSegments: number = 16, radialSegments: number = 32, heightSegments: number = 1): Model {
        const geom = new CapsuleGeometry(radius, height, capSegments, radialSegments, heightSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Capsule";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static cone(radius: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1, openEnded: boolean = false): Model {
        const geom = new ConeGeometry(radius, height, radialSegments, heightSegments, openEnded);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Cone";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static cylinder(radiusTop: number = 1, radiusBottom: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1, openEnded: boolean = false): Model {
        const geom = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Cylinder";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static ring(innerRadius: number = 0.5, outerRadius: number = 1, thetaSegments: number = 32, phiSegments: number = 1): Model {
        const geom = new RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Ring";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static sphere(radius: number = 1, widthSegments: number = 32, heightSegments: number = 16): Model {
        const geom = new SphereGeometry(radius, widthSegments, heightSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Sphere";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static torus(radius: number = 1, tube: number = 0.4, radialSegments: number = 12, tubularSegments: number = 48): Model {
        const geom = new TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "Torus";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }

    static torusknot(radius: number = 1, tube: number = 0.4, tubularSegments: number = 256, radialSegments: number = 32, p: number = 2, q: number = 3): Model {
        const geom = new TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        const mat = new StandardMaterial();
        const primitive = new Primitive(geom, mat);

        const mesh = new Mesh();
        mesh.primitives.push(primitive);
        mesh.name = "TorusKnot";

        const model = new Model();
        model.meshes.push(mesh);

        return model;
    }
}