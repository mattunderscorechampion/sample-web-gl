(function setupVRSample() {
    var skyColour = 0xfafafa;
    var objectColour = 0x9bb2ff;
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
        button.style.position = 'absolute';
        button.style.top = '0px';
        button.style.left = '0px';
        button.textContent = 'Enter VR mode';
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
        light.position.set(0, 50, 0).normalize();
        return [ambientLight, light];
    }
    function createSkyBox() {
        var skyBoxGeometry = new THREE.SphereGeometry(100, 100, 100);
        var skyBoxMaterial = new THREE.MeshLambertMaterial({ color: skyColour, side: THREE.BackSide });
        return new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    }
    function createObject() {
        var baseGeometry = new THREE.SphereGeometry(2, 100, 100);
        var baseMaterial = new THREE.MeshLambertMaterial({ color: objectColour });
        var mesh = new THREE.Mesh(baseGeometry, baseMaterial);
        mesh.position.set(1, 1, -5).normalize();
        return mesh;
    }
    createLight().forEach(function (o) { return scene.add(o); });
    scene.add(createSkyBox());
    scene.add(createObject());
    function animate() {
        renderer.render(scene, camera);
    }
    renderer.animate(animate);
    detectVR();
}());
//# sourceMappingURL=vr-sample.js.map