import { BoxGeometry, CapsuleGeometry, ConeGeometry, CubeGeometry, CylinderGeometry, RingGeometry, SphereGeometry, TorusGeometry, TorusKnotGeometry } from "./geometries";
import { StandardMaterial } from "./materials";
import { Mesh } from "./mesh";
import { Primitive } from "./primitive";

export class Model {
    #meshes = [];
    #joints = [];
    #animations = [];
    #skins = [];

    get meshes() {
        return this.#meshes;
    }

    set meshes(value) {
        this.#meshes = value;
    }

    get joints() {
        return this.#joints;
    }

    set joints(value) {
        this.#joints = value;
    }

    get animations() {
        return this.#animations;
    }

    set animations(value) {
        this.#animations = value;
    }

    get skins() {
        return this.#skins;
    }

    set skins(value) {
        this.#skins = value;
    }

    constructor() {
        this.#meshes = [];
        this.#joints = [];
        this.#animations = [];
        this.#skins = [];
    }

    /* FACTORY FUNCTIONS */
    static cube(size = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
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

    static box(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
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

    static capsule(radius = 1, height = 1, capSegments = 16, radialSegments = 32, heightSegments = 1) {
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

    static cone(radius = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
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

    static cylinder(radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
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

    static ring(innerRadius = 0.5, outerRadius = 1, thetaSegments = 32, phiSegments = 1) {
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

    static sphere(radius = 1, widthSegments = 32, heightSegments = 16) {
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

    static torus(radius = 1, tube = 0.4, radialSegments = 12, tubularSegments = 48) {
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

    static torusknot(radius = 1, tube = 0.4, tubularSegments = 256, radialSegments = 32, p = 2, q = 3) {
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