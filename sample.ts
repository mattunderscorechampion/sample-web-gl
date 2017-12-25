
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 0);
scene.add(light);

const skyBoxGeometry = new THREE.SphereGeometry(100, 100, 100);
const skyBoxMaterial = new THREE.MeshLambertMaterial({ color: 0xfafafa, side: THREE.BackSide });
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

const baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 100);
const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x9bb2ff });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -1;
scene.add(base);

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
const mugBSP = outerMugBSP.union(translatedHandleBSP).subtract(innerMugBSP);
const mug = mugBSP.toMesh(new THREE.MeshLambertMaterial({ color: 0x8fd88c }));
scene.add(mug);

const coffeeGeometry = new THREE.CylinderGeometry(0.95, 0.85, 1.9, 100);
const coffeeMaterial = new THREE.MeshLambertMaterial({ color: 0x844600 });
const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
scene.add(coffee);

camera.position.z = 5;
controls.update();

function animate() {
    requestAnimationFrame(animate);

    base.rotation.y += 0.01;
    mug.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}
animate();
