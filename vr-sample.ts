
(function setupVRSample() {
    const skyColour = 0xfafafa;
    const baseColour = 0x9bb2ff;
    const mugColour = 0x8fd88c;
    const coffeeColour = 0x844600;

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
        button.style.fontSize = '24';
        button.style.position = 'fixed';
        button.style.bottom = '28px';
        button.style.right = '28px';
        button.style.padding = '10px';
        button.textContent = 'VR';
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
        light.position.set(0, 5, 0);

        return [ambientLight, light];
    }

    function createSkyBox(): THREE.Mesh {
        const skyBoxGeometry = new THREE.SphereGeometry(100, 30, 30);
        const skyBoxMaterial = new THREE.MeshLambertMaterial({ color: skyColour, side: THREE.BackSide });
        return new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    }

    function createBase(): THREE.Mesh {
        const baseGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 60);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: baseColour });
        const mesh = new THREE.Mesh(baseGeometry, baseMaterial);
        mesh.position.set(0, -3, -7);
        return mesh;
    }

    function createMug(withCoffee: boolean): THREE.Mesh[] {
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 35, 35));
        handle.translateOnAxis(new THREE.Vector3(1, 0, 0), 0.9);
        handle.translateOnAxis(new THREE.Vector3(0, 1, 0), 0.18);
        const translatedHandleBSP = new ThreeBSP(handle);

        const outerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(1, 0.9, 2, 60)));
        const innerMugBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.85, 2, 60)));
        const bottomBSP = new ThreeBSP(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 60)));
        const bottom = bottomBSP.toMesh();
        bottom.translateOnAxis(new THREE.Vector3(0, 1, 0), -0.95);
        const translatedBottomBSP = new ThreeBSP(bottom);
        const mugBSP = outerMugBSP.union(translatedHandleBSP).subtract(innerMugBSP).union(translatedBottomBSP);
        const mug = mugBSP.toMesh(new THREE.MeshLambertMaterial({ color: mugColour }));

        const result: [THREE.Mesh] = [mug];

        if (withCoffee) {
            const coffeeGeometry = new THREE.CylinderGeometry(0.95, 0.85, 1.9, 60);
            const coffeeMaterial = new THREE.MeshLambertMaterial({ color: coffeeColour });
            result.push(new THREE.Mesh(coffeeGeometry, coffeeMaterial));
        }

        result.forEach(mesh => mesh.position.set(0, -2, -7));

        return result;
    }

    createLight().forEach(light => scene.add(light));

    scene.add(createSkyBox());
    scene.add(createBase());
    createMug(true).forEach(mesh => scene.add(mesh));

    function animate() {
        renderer.render(scene, camera);
    }

    renderer.animate(animate);

    detectVR();
}());
