
(function setupVRSample() {
    const skyColour = 0xfafafa;
    const objectColour = 0x9bb2ff;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function tryPresentAsVR() {
        if ('getVRDisplays' in navigator) {
            navigator.getVRDisplays().then(displays => {
                if (displays.length > 0) {
                    console.log('VR device detected');

                    let display = displays[0];
                    renderer.vr.enabled = true;
                    renderer.vr.setDevice(display);
                    display.requestPresent([{ source: renderer.domElement }]);
                }
                else {
                    console.log('No VR devices detected');
                }
            }, () => console.log('Failed to detect VR devices'));
        }
        else {
            console.log('No VR devices detected');
        }
    }

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

    function createObject(): THREE.Mesh {
        const baseGeometry = new THREE.SphereGeometry(2, 100, 100);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: objectColour });
        return new THREE.Mesh(baseGeometry, baseMaterial);
    }

    createLight().forEach(o => scene.add(o));

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
