class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 2;
        this.scene.add(this.camera);
        this.pointLight = new THREE.PointLight(0x404040);
        this.pointLight.position.set(30, 50, 50);

        this.pointLight.castShadow = true;
        this.pointLight.shadow.camera.near = 1;
        this.pointLight.shadow.camera.far = 60;

        this.pointLight.shadow.mapSize.width = 1024;
        this.pointLight.shadow.mapSize.height = 1024;
        this.d = 390;
        this.pointLight.shadow.camera.left = -this.d;
        this.pointLight.shadow.camera.right = this.d;
        this.pointLight.shadow.camera.top = this.d * 1.5;
        this.pointLight.shadow.camera.bottom = -this.d;
        this.pointLight.shadow.camera.far = 3500;

        this.floorGeometry = new THREE.BoxBufferGeometry(10, 0.1, 10);
        this.floorMaterial = new THREE.MeshPhongMaterial({emissive: 0x888888});

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floor.position.y = -0.55;

        this.scene.add(this.floor);
        this.floor.receiveShadow = true;

        this.scene.add(this.pointLight);

        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;

        //this.ambientLight = new THREE.AmbientLight(0xffffff);
        // this.scene.add(this.ambientLight);

        this.mouse = new THREE.Vector2(0, 0);
        this.raycaster = new THREE.Raycaster();

        this.menuButton = document.getElementById("list-button");
        this.menu = document.getElementById("list-container");
        this.menuToggled = false;


        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.loader = new THREE.TDSLoader();
        this.materialLoader = new THREE.TextureLoader();
        this.path = 'modele/KomodaHLong.3ds';
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.highlightMaterial = new THREE.MeshStandardMaterial({
            visible: true,
            color: 'white',
            emissive: 1.5,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.animate = this.animate.bind(this);
        this.listeners = this.listeners.bind(this);
        this.listeners();
        this.getModel();
        this.animate();
    }

    listeners() {

        window.addEventListener('click', (event) => {
            event.preventDefault();
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.checkIntersections();
        });

        window.addEventListener("resize", function () {
            this.screenHeight = window.innerHeight;
            this.screenWidth = window.innerWidth;
            this.renderer.setSize(this.screenWidth, this.screenHeight, true);
            this.camera.aspect = this.screenWidth / this.screenHeight;
            this.camera.updateProjectionMatrix();
        });

        this.menuButton.addEventListener('click', () => {
            this.menuToggled = !this.menuToggled;
            this.menu.classList.toggle("not-active");
        });
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    makeAList() {
        const materials = ["bialy.JPG", "niebieski.JPG", "okleina.JPG", "szary.JPG", "zolty.JPG"];
        const list = document.getElementById("materials-list");
        for (let x = 0; x < materials.length; x++) {
            let li = document.createElement("li");

            let widthMultiplayer = (this.screenWidth < 600 ? 1.0 : 0.125)
            let heightMultiplayer = (this.screenWidth < 600 ? 0.050 : 0.125)
            let image = new Image(this.screenWidth * widthMultiplayer, this.screenHeight * heightMultiplayer);
            image.src = "materialy/" + materials[x];

            image.addEventListener('click', () => {
                let currentImage = image.src;
                this.setMaterial(currentImage);
            });

            li.appendChild(image);
            list.appendChild(li);
        }
    }

    setMaterial(image) {
        console.log('x');
        this.materialLoader.setPath('');
        this.currentMaterial = this.materialLoader.load(image, (texture) => {
            this.currentObject.material = new THREE.MeshStandardMaterial({
                map: texture,
                color: 'white',
                side: THREE.DoubleSide,
                vertexColors: THREE.FaceColors
            });
        });
    }

    checkIntersections() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.deleteHighlighted();
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let intersectedObject = intersects[0];
            if (intersectedObject.object.userData.savedMaterial === undefined) {
                this.currentObject = intersectedObject.object;
                intersectedObject.object.userData.savedMaterial = intersectedObject.object.material;
                intersectedObject.object.material = this.highlightMaterial;
                intersectedObject.object.geometry.elementsNeedUpdate = true;

            }
        }
    }

    deleteHighlighted() {
        this.scene.traverse((object) => {
            if (object.userData.savedMaterial !== undefined) {
                object.material = object.userData.savedMaterial;
                object.userData.savedMaterial = undefined;
            }
        });
    };


    getMaterials() {
        this.materialLoader.setPath('materialy');

    }

    getModel() {
        this.loader.setPath(this.path);
        this.loader.load(this.path, (object) => {
            this.scene.add(object);
            this.object = object;
            this.object.rotateX(270 * Math.PI / 180);
            this.object.position.y = -0.35;
            this.object.castShadow = true;
            this.object.receiveShadow = true;
            this.object.name = "model";
            this.getMaterials();

        });

    };


}

const app = new App();