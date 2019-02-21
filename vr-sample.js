(function setupVRSample() {
    var skyColour = 0xfafafa;
    var baseColour = 0x9bb2ff;
    var mugColour = 0x8fd88c;
    var coffeeColour = 0x844600;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.vr.enabled = true;
    document.body.appendChild(renderer.domElement);
    window.addEventListener('vrdisplaypointerrestricted', function () {
        if (typeof (renderer.domElement.requestPointerLock) === 'function') {
            renderer.domElement.requestPointerLock();
        }
    }, false);
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
    function showEnterVR(display) {
        var button = document.createElement('button');
        button.style.fontSize = '24';
        button.style.position = 'fixed';
        button.style.bottom = '28px';
        button.style.right = '28px';
        button.style.padding = '10px';
        button.textContent = 'VR';
        document.body.appendChild(button);
        button.addEventListener('click', function (event) {
            renderer.vr.setDevice(display);
            display.requestPresent([{ source: renderer.domElement }]);
        });
    }
    function detectVR() {
        if ('getVRDisplays' in navigator) {
            navigator.getVRDisplays().then(function (displays) {
                if (displays.length > 0) {
                    console.log('VR device detected');
                    var display = displays[0];
                    showEnterVR(display);
                }
                else {
                    console.log('No VR devices detected');
                }
            }, function () { return console.log('Failed to detect VR devices'); });
        }
        else {
            console.log('No VR devices detected');
        }
    }
    function createLight() {
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 5, 0);
        return [ambientLight, light];
    }
    function createSkyBox() {
        var skyBoxGeometry = new THREE.SphereGeometry(100, 30, 30);
        var skyBoxMaterial = new THREE.MeshLambertMaterial({ color: skyColour, side: THREE.BackSide });
        return new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    }
    function createBase() {
        var baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 60);
        var baseMaterial = new THREE.MeshLambertMaterial({ color: baseColour });
        var mesh = new THREE.Mesh(baseGeometry, baseMaterial);
        mesh.position.set(0, -3, -7);
        return mesh;
    }
    function createMug(withCoffee) {
        var handle = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 35, 35));
        handle.translateOnAxis(new THREE.Vector3(1, 0, 0), 0.9);
        handle.translateOnAxis(new THREE.Vector3(0, 1, 0), 0.18);
        var translatedHandleBSP = new ThreeBSP(handle);
        var outerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(1, 0.9, 2, 60)));
        var innerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.85, 2, 60)));
        var bottomBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 60)));
        var bottom = bottomBSP.toMesh();
        bottom.translateOnAxis(new THREE.Vector3(0, 1, 0), -0.95);
        var translatedBottomBSP = new ThreeBSP(bottom);
        var mugBSP = outerMugBSP.union(translatedHandleBSP).subtract(innerMugBSP).union(translatedBottomBSP);
        var mug = mugBSP.toMesh(new THREE.MeshLambertMaterial({ color: mugColour }));
        var result = [mug];
        if (withCoffee) {
            var coffeeGeometry = new THREE.CylinderGeometry(0.95, 0.85, 1.9, 60);
            var coffeeMaterial = new THREE.MeshLambertMaterial({ color: coffeeColour });
            result.push(new THREE.Mesh(coffeeGeometry, coffeeMaterial));
        }
        result.forEach(function (mesh) { return mesh.position.set(0, -2, -7); });
        return result;
    }
    createLight().forEach(function (light) { return scene.add(light); });
    scene.add(createSkyBox());
    scene.add(createBase());
    createMug(true).forEach(function (mesh) { return scene.add(mesh); });
    function animate() {
        renderer.render(scene, camera);
    }
    renderer.animate(animate);
    detectVR();
}());
//# sourceMappingURL=vr-sample.js.map