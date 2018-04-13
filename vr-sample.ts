
(function setupVRSample() {
    const skyColour = 0xfafafa;
    const objectColour = 0x9bb2ff;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.vr.enabled = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener( 'vrdisplaypointerrestricted', function () {
        if (typeof(renderer.domElement.requestPointerLock) === 'function') {
            renderer.domElement.requestPointerLock();
        }
    }, false );

    window.addEventListener( 'resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    function showEnterVR(display) {
        let button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top = '0px';
        button.style.left = '0px';
        button.textContent = 'Enter VR mode';
        document.body.appendChild(button);
        button.addEventListener('click', event => {
            renderer.vr.setDevice(display);
            display.requestPresent([{ source: renderer.domElement }]);
        });
    }

    function detectVR() {
        if ('getVRDisplays' in navigator) {
            navigator.getVRDisplays().then(displays => {
                if (displays.length > 0) {
                    console.log('VR device detected');

                    let display = displays[0];

                    showEnterVR(display);
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

    function createLight(): THREE.Light[] {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 50, 0).normalize();

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
        const mesh = new THREE.Mesh(baseGeometry, baseMaterial);
        mesh.position.set(1, 1, -5).normalize();
        return mesh;
    }

    createLight().forEach(o => scene.add(o));

    scene.add(createSkyBox());

    scene.add(createObject());

    function animate() {
        renderer.render(scene, camera);
    }

    renderer.animate(animate);

    detectVR();
}());
