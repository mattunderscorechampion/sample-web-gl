
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera);

const skyBoxGeometry = new THREE.BoxGeometry(100, 100, 100);
const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xfafafa, side: THREE.BackSide });
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x009900 });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = -0.4;
scene.add(cube);

const baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 50);
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x000099 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -1;
scene.add(base);

camera.position.z = 5;
controls.update();

function animate() {
    requestAnimationFrame(animate);

    base.rotation.y += 0.01;
    cube.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}
animate();
