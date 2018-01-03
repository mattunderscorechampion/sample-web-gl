(function setupVRSample() {
    var skyColour = 0xfafafa;
    var objectColour = 0x9bb2ff;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    function tryPresentAsVR() {
        if ('getVRDisplays' in navigator) {
            navigator.getVRDisplays().then(function (displays) {
                if (displays.length > 0) {
                    console.log('VR device detected');
                    var display = displays[0];
                    renderer.vr.enabled = true;
                    renderer.vr.setDevice(display);
                    display.requestPresent([{ source: renderer.domElement }]);
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
        light.position.set(0, 50, 0);
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
        return new THREE.Mesh(baseGeometry, baseMaterial);
    }
    createLight().forEach(function (o) { return scene.add(o); });
    scene.add(createSkyBox());
    scene.add(createObject());
    camera.position.z = 5;
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    tryPresentAsVR();
}());
//# sourceMappingURL=vr-sample.js.map