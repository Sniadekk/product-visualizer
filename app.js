const config = {
  materials: [
    "bialy",
    "niebieski",
    "okleina",
    "szary",
    "zolty",
    "jasnybraz",
    "szarybraz"
  ],
  extension: ".jpg",
  modelPath: "/modele/komodaHBasic.3ds"
};

const materialConfig = [
  { material: "niebieski" },
  { material: "niebieski" },
  { material: "okleina" },
  { material: "okleina" },
  { material: "zolty" },
  { material: "okleina" },
  { material: "zolty" },
  { material: "okleina" },
  { material: "okleina" }
];
const models = {
  komodaHBasicWiszaca: {
    setup: [
      { material: "niebieski" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
    ]
  },
  komodaHLong: {
    setup: [
      { material: "okleina" },
      { material: "okleina" },
      { material: "bialy" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "niebieski" },
      { material: "okleina" },
      { material: "niebieski" },
      { material: "okleina" },
      { material: "okleina" }
    ]
  },

  komodaHHigh: {
    setup: [
      { material: "okleina" },
      { material: "niebieski" },
      { material: "niebieski" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" }
    ]
  },

  komodaHBasic: {
    setup: [
      { material: "niebieski" },
      { material: "niebieski" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "zolty" },
      { material: "okleina" },
      { material: "zolty" },
      { material: "okleina" },
      { material: "okleina" }
    ]
  },

  komodaHLongWiszaca: {
    setup: [
      { material: "okleina" },
      { material: "bialy" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "bialy" },
      { material: "okleina" },
      { material: "niebieski" },
      { material: "okleina" },
      { material: "okleina" },
      { material: "okleina" }
    ]

  }
}
class App {
  constructor(model) {
    //container of our application
    this.appContainer = document.querySelector("#three-app");
    //size properties of our application container
    this.containerHeight = window.innerHeight * 0.8;
    this.containerWidth = window.innerWidth * 0.8;
    //screen size
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.model = model;
    //Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    //User's camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.containerWidth / this.containerHeight,
      0.1,
      10000
    );
    //Setting it up in the "middle"
    this.camera.position.set(0, 0, 3);
    this.scene.add(this.camera);


    //this.path = config.modelPath;
    this.path = "/modele/" + model + ".3ds";
    this.ambientLight = new THREE.AmbientLight(0xdee0e2, 1.45);

    this.scene.add(this.ambientLight);

    this.spotLight = new THREE.SpotLight(0xffffff, 0.35, 0, Math.PI / 6);
    // this.spotLight.castShadow = true;
    // this.spotLight.shadow.camera.far = 3500;
    // this.spotLight.angle = 2;


    // this.spotLight.shadow.bias = 0.001;
    // this.spotLight.shadow.mapSize.width = 4096;
    // this.spotLight.shadow.mapSize.height = 4096;

    this.spotLight.position.set(2.4, 3.5, 3.5);
    this.scene.add(this.spotLight);

    //Vector to hold mouse position
    this.mouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.loader = new THREE.TDSLoader();
    this.materialLoader = new THREE.TextureLoader();
    this.highlightMaterial = new THREE.MeshStandardMaterial({
      visible: true,
      color: "white",
      emissive: 1.5,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });

    this.materials = {};

    //setting size of renderer equal to app container size
    this.renderer.setSize(this.containerWidth, this.containerHeight);
    this.appContainer.appendChild(this.renderer.domElement);

    //binding async functions
    this.animate = this.animate.bind(this);
    this.listeners = this.listeners.bind(this);

    //controller of mouse/touch/keyboard/etc.
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.minDistance = 1;
    this.controls.maxDistance = 4;
    // this.controls.maxPolarAngle = Math.PI / 2.5;

    this.appContainer.classList.toggle("not-active");
    document.querySelector("#list-container").classList.toggle("not-active");

    // this.makeWalls();
    this.makeAList();
    this.listeners();
    this.getModel();
  }

  makeWalls() {
    this.walls = new Walls();
    this.walls.meshes.map(wall => this.scene.add(wall));
  }

  listeners() {
    window.addEventListener("click", event => {
      event.preventDefault();
      this.mouse.x = (event.clientX - this.renderer.domElement.offsetLeft) / this.screenWidth * 2 - 1;
      this.mouse.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.screenHeight) * 2 + 1;
      this.checkIntersections();
    });

    window.addEventListener("resize", function () {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      this.renderer.setSize(this.screenWidth, this.screenHeight, true);
      this.camera.aspect = this.screenWidth / this.screenHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  makeAList() {
    const list = document.getElementById("materials-list");
    for (let x = 0; x < config.materials.length; x++) {
      let li = document.createElement("li");

      let widthMultiplayer = this.screenWidth < 600 ? 1.0 : 0.125;
      let heightMultiplayer = this.screenWidth < 600 ? 0.05 : 0.125;
      let image = new Image(
        this.screenWidth * widthMultiplayer,
        this.screenHeight * heightMultiplayer
      );
      image.src = "materialy/" + config.materials[x] + config.extension;

      image.addEventListener("click", () => {
        let currentImage = image.src;
        this.setMaterial(currentImage);
      });

      li.appendChild(image);
      list.appendChild(li);
    }
  }

  setMaterials() {
    this.object.children.map((object, index) => {
      const material = this.materials[models[this.model].setup[index].material]
      if (typeof material !== "undefined")
        object.material = material;
    });
    this.animate();
  }

  checkIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.deleteHighlighted();
    let intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      let intersectedObject = intersects[0];
      if (intersectedObject.object.name.includes("wall")) return;
      if (intersectedObject.object.userData.savedMaterial === undefined) {
        this.currentObject = intersectedObject.object;
        intersectedObject.object.userData.savedMaterial =
          intersectedObject.object.material;
        intersectedObject.object.material = this.highlightMaterial;
        intersectedObject.object.geometry.elementsNeedUpdate = true;
      }
    }
  }

  deleteHighlighted() {
    this.scene.traverse(object => {
      if (object.userData.savedMaterial !== undefined) {
        object.material = object.userData.savedMaterial;
        object.userData.savedMaterial = undefined;
      }
    });
  }

  getMaterials() {
    this.materialLoader.setPath("materialy/");
    config.materials.map((item, index) => {
      this.materialLoader.load(item + config.extension, material => {
        material.wrapS = THREE.RepeatWrapping;
        material.wrapT = THREE.RepeatWrapping;
        this.materials[item] = new THREE.MeshStandardMaterial({
          visible: true,
          map: material,
          color: "white",
          lightMapIntensity: 2,
          side: THREE.DoubleSide
        });
      });
    });
    setTimeout(() => {
      this.setMaterials();
      this.animate();
    }, 3000);
  }

  setMaterial(image) {
    this.materialLoader.setPath("");
    this.currentMaterial = this.materialLoader.load(image, texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      this.currentObject.material = new THREE.MeshStandardMaterial({
        visible: true,
        map: texture,
        color: "white",
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors,
        metalness: 0.35,
        emissiveIntensity: 0
      });
    });
  }

  getModel() {
    this.loader.setPath(this.path);
    this.loader.load(this.path, object => {
      this.scene.add(object);
      this.object = object;
      this.object.rotateX(270 * Math.PI / 180);
      this.object.position.y = -0.5;
      console.log(this.camera, this.object);
      // this.object.children.map(child => {
      //   child.castShadow = true;
      // });
      this.object.name = "model";
      // this.camera.lookAt(this.object.position);
      this.getMaterials();
      this.animate();
    });
  }
}
init();
//const app = new App();
function init() {
  let didAppStart = false;
  const threeDiv = document.querySelector("#three-app");
  const closeButton = document.querySelector("#three-app-close_button");
  const modal = document.querySelector("#three-app-modal");

  document.querySelector("#app").addEventListener("click", (evt) => {
    if (didAppStart === false) {
      const model = evt.target.value;
      const app = new App(model);


    }
    modal.classList.remove("not-active");
    threeDiv.classList.remove("not-active");
    didAppStart = true;
  })

  closeButton.addEventListener("click", () => {
    toggleApp();
  });


  function toggleApp() {
    threeDiv.classList.add("not-active");
    modal.classList.add("not-active");
  }
}