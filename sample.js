var skyColour = 0xfafafa;
var baseColour = 0x9bb2ff;
var mugColour = 0x8fd88c;
var coffeeColour = 0x844600;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera);
function createLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 50, 0);
    return [ambientLight, light];
}
function createSkyBox() {
    var skyBoxGeometry = new THREE.SphereGeometry(100, 100, 100);
    var skyBoxMaterial = new THREE.MeshLambertMaterial({ color: skyColour, side: THREE.BackSide });
    return new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
}
function createBase() {
    var baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 100);
    var baseMaterial = new THREE.MeshLambertMaterial({ color: baseColour });
    return new THREE.Mesh(baseGeometry, baseMaterial);
}
function createMug(withCoffee) {
    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 50, 50));
    handle.translateOnAxis(new THREE.Vector3(1, 0, 0), 0.9);
    handle.translateOnAxis(new THREE.Vector3(0, 1, 0), 0.18);
    var translatedHandleBSP = new ThreeBSP(handle);
    var outerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(1, 0.9, 2, 100)));
    var innerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.85, 2, 100)));
    var bottomBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 100)));
    var bottom = bottomBSP.toMesh();
    bottom.translateOnAxis(new THREE.Vector3(0, 1, 0), -0.95);
    var translatedBottomBSP = new ThreeBSP(bottom);
    var mugBSP = outerMugBSP.union(translatedHandleBSP).subtract(innerMugBSP).union(translatedBottomBSP);
    var mug = mugBSP.toMesh(new THREE.MeshLambertMaterial({ color: mugColour }));
    var result = [mug];
    if (withCoffee) {
        var coffeeGeometry = new THREE.CylinderGeometry(0.95, 0.85, 1.9, 100);
        var coffeeMaterial = new THREE.MeshLambertMaterial({ color: coffeeColour });
        result.push(new THREE.Mesh(coffeeGeometry, coffeeMaterial));
    }
    return result;
}
createLight().forEach(function (o) { return scene.add(o); });
scene.add(createSkyBox());
var base = createBase();
base.position.y = -1;
scene.add(base);
var mug = createMug(true);
mug.forEach(function (o) { return scene.add(o); });
camera.position.z = 5;
controls.update();
function animate() {
    requestAnimationFrame(animate);
    base.rotation.y += 0.01;
    mug.forEach(function (o) { return o.rotation.y += 0.01; });
    controls.update();
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=sample.js.map