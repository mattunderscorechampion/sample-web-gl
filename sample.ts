
const skyColour = 0xfafafa;
const baseColour = 0x9bb2ff;
const mugColour = 0x8fd88c;
const coffeeColour = 0x844600;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera);

function createLight(): [THREE.Light] {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 50, 0);

    return [ambientLight, light];
}

function createSkyBox(): THREE.Mesh {
    const skyBoxGeometry = new THREE.SphereGeometry(100, 100, 100);
    const skyBoxMaterial = new THREE.MeshLambertMaterial({ color: skyColour, side: THREE.BackSide });
    return new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
}

function createBase(): THREE.Mesh {
    const baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 100);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: baseColour });
    return new THREE.Mesh(baseGeometry, baseMaterial);
}

function createMug(withCoffee: boolean): [THREE.Mesh] {
    const outerHandleBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 100)));
    const innerHandleBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 100)));
    const handleBSP = outerHandleBSP.subtract(innerHandleBSP);
    const handle = handleBSP.toMesh();
    handle.rotateX(0.5 * Math.PI);
    handle.translateOnAxis(new THREE.Vector3(1, 0, 0), 1);
    handle.translateOnAxis(new THREE.Vector3(0, 0, 1), -0.2);
    const translatedHandleBSP = new ThreeBSP(handle);

    const outerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(1, 0.9, 2, 100)));
    const innerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.85, 2, 100)));
    const bottomBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 100)));
    const bottom = bottomBSP.toMesh();
    bottom.translateOnAxis(new THREE.Vector3(0, 1, 0), -0.95);
    const translatedBottomBSP = new ThreeBSP(bottom);
    const mugBSP = outerMugBSP.union(translatedHandleBSP).subtract(innerMugBSP).union(translatedBottomBSP);
    const mug = mugBSP.toMesh(new THREE.MeshLambertMaterial({ color: mugColour }));

    const result: [THREE.Mesh] = [mug];

    if (withCoffee) {
        const coffeeGeometry = new THREE.CylinderGeometry(0.95, 0.85, 1.9, 100);
        const coffeeMaterial = new THREE.MeshLambertMaterial({ color: coffeeColour });
        result.push(new THREE.Mesh(coffeeGeometry, coffeeMaterial));
    }

    return result;
}

createLight().forEach(o => scene.add(o));

scene.add(createSkyBox());

const base = createBase();
base.position.y = -1;
scene.add(base);

const mug = createMug(true);
mug.forEach(o => scene.add(o));

camera.position.z = 5;
controls.update();

function animate() {
    requestAnimationFrame(animate);

    base.rotation.y += 0.01;
    mug.forEach(o => o.rotation.y += 0.01);

    controls.update();
    renderer.render(scene, camera);
}
animate();
