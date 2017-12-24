
declare class ThreeBSP {
    constructor(mesh: THREE.Mesh);

    subtract(bsp: ThreeBSP): ThreeBSP;

    toMesh(material: THREE.Material): THREE.Mesh;
}
