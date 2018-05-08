const config = {
  materials: ["bialy", "niebieski", "okleina", "szary", "zolty"],
  extension: ".jpg",
  modelPath: "/modele/komodaHBasic.3ds"
};

//temporary json with configurations before I get something to work with shop's administrator panel
const models = {
  komodaHBasicWiszaca: {
    setup: [
      {
        material: "niebieski"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "bialy"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      }
    ]
  },
  komodaHLong: {
    setup: [
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "bialy"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "niebieski"
      },
      {
        material: "okleina"
      },
      {
        material: "niebieski"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      }
    ]
  },

  komodaHHigh: {
    setup: [
      {
        material: "okleina"
      },
      {
        material: "niebieski"
      },
      {
        material: "niebieski"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      }
    ]
  },

  komodaHBasic: {
    setup: [
      {
        material: "okleina"
      },
      {
        material: "niebieski"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "zolty"
      },
      {
        material: "okleina"
      },
      {
        material: "zolty"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      }
    ]
  },

  komodaHLongWiszaca: {
    setup: [
      {
        material: "okleina"
      },
      {
        material: "bialy"
      },
      {
        material: "bialy"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "bialy"
      },
      {
        material: "bialy"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      },
      {
        material: "okleina"
      }
    ]
  }
};

class App {
  //model is a name of a model which is hold in button's value
  constructor(model) {
    //container of our application
    this.appContainer = document.querySelector("#three-app");
    //check whether screen it is mobile screen or not
    this.screenMultiplayer = window.innerWidth < 800 ? 1.0 : 0.8;
    //size properties of our application container
    this.containerHeight = window.innerHeight * this.screenMultiplayer;
    this.containerWidth = window.innerWidth * this.screenMultiplayer;
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

    this.scene.add(this.camera);

    //this.path = config.modelPath;
    this.path = "../modele/" + model + ".3ds";
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

    this.scene.add(this.ambientLight);

    //Additional light to make furnitures look better
    this.spotLight = new THREE.DirectionalLight(0xffffff, 0.4);
    this.camera.add(this.spotLight);

    //Vector to hold mouse position
    this.mouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();

    //our webgl renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    //Loader to load .3ds 3d models
    this.loader = new THREE.TDSLoader();
    //Image loader
    this.materialLoader = new THREE.TextureLoader();
    //Material to use when user click somewhere on the object
    this.highlightMaterial = new THREE.MeshStandardMaterial({
      visible: true,
      color: "white",
      emissive: 1.5,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });

    //Object of material objects
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

    //Setting up nice look depending on screen resolution
    if (this.screenMultiplayer === 1) {
      this.controls.maxDistance = 5;
      this.camera.position.set(0, 0, 5);
    } else {
      this.controls.maxDistance = 3;
      this.camera.position.set(0, 0, 2.5);
    }
    this.controls.minDistance = 1;

    this.controls.maxPolarAngle = Math.PI / 2;

    this.appContainer.classList.toggle("not-active");
    document.querySelector("#list-container").classList.toggle("not-active");

    //this.makeWalls();
    this.makeAList();
    this.listeners();
    this.getModel();
  }

  //this function creates Walls object which is used to create walls around our object to simulate room
  makeWalls() {
    this.walls = new Walls();
    this.walls.meshes.map(wall => this.scene.add(wall));
  }

  //event listeners
  listeners() {
    window.addEventListener("click", event => {
      console.log(event.offsetY, event.offsetX);
      event.preventDefault();
      this.mouse.x =
       ((event.clientX ) /
          this.screenWidth) *2 -   1;
      this.mouse.y = -(
          (event.clientY) /
          this.screenHeight) *  2 + 1;
      //here we check if user clicked on object
      this.checkIntersections();
    });

    //adjusting application after resize
    window.addEventListener("resize", () => {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      this.renderer.setSize(this.screenWidth, this.screenHeight, true);
      this.camera.aspect = this.screenWidth / this.screenHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  //animation loop
  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  //Making a list of materials. For now it's like hard coded, because I don't know from where I will fetch data on server/\.
  makeAList() {
    const list = document.getElementById("materials-list");
    for (let x = 0; x < config.materials.length; x++) {
      if (config.materials[x] === "okleina") continue;

      let li = document.createElement("li");
      li.dataset.value = config.materials[x];

      let widthMultiplayer = this.screenWidth < 600 ? 1.0 : 0.125;
      let heightMultiplayer = this.screenWidth < 600 ? 0.05 : 0.125;
      let image = new Image(
        this.screenWidth * widthMultiplayer,
        this.screenHeight * heightMultiplayer
      );
      image.src = "materialy/" + config.materials[x] + config.extension;
      //listener to every image, to create new material and append it to object
      image.addEventListener("click", () => {
        let currentImage = image.src;
        this.setMaterial(currentImage);
      });

      li.appendChild(image);
      list.appendChild(li);
    }
  }

  //After materials are fetched and created they are applied  to object based on json configuration
  setMaterials() {
    this.object.children.map((object, index) => {
      const material = this.materials[models[this.model].setup[index].material];
      if (typeof material !== "undefined") object.material = material;
    });

    //after everything is done - disable loading animation and start rendering loop
    disableLoadingModal();
    this.animate();
  }

  checkIntersections() {
    //Raycaster is set and gets mouse vector
    this.raycaster.setFromCamera(this.mouse, this.camera);
    //delete highlighted material
    this.deleteHighlighted();
    //check if raycaster intersects with some objects
    let intersects = this.raycaster.intersectObjects(this.scene.children, true);
    //if it does apply material
    if (intersects.length > 0) {
      //get only the first intersected object, because it's always an array of two items. From front side and back side of an object.
      let intersectedObject = intersects[0];
      console.log(intersectedObject);
      //if intersected object is a wall - return from the function
      if (intersectedObject.object.material.name.includes("okleina")) return;
      //if it's not the same place clicked once again with highlighted material, apply one
      if (intersectedObject.object.userData.savedMaterial === undefined) {
        //store current intersected object for future use
        this.currentObject = intersectedObject.object;
        //Original material to apply it when highlighted one is gone
        intersectedObject.object.userData.savedMaterial =
          intersectedObject.object.material;
        intersectedObject.object.material = this.highlightMaterial;
        //update object
        intersectedObject.object.geometry.elementsNeedUpdate = true;
      }
    }
  }

  //Delete highlighted material
  deleteHighlighted() {
    this.scene.traverse(object => {
      if (object.userData.savedMaterial !== undefined) {
        object.material = object.userData.savedMaterial;
        object.userData.savedMaterial = undefined;
      }
    });
  }

  getMaterials() {
    //set path for material loader
    this.materialLoader.setPath("materialy/");
    //iterate materials described in config file
    config.materials.map((item, index) => {
      //load every material
      this.materialLoader.load(item + config.extension, material => {
        //apply some three.js properties
        material.wrapS = THREE.RepeatWrapping;
        material.wrapT = THREE.RepeatWrapping;
        this.materials[item] = new THREE.MeshStandardMaterial({
          visible: true,
          map: material,
          name:item

          // emissiveIntensity: 0
        });
        //if loading of materials is done, set them to our 3d model
        if (Object.keys(this.materials).length === config.materials.length)
          this.setMaterials();
      });
    });
  }

  //get current clicked image and store it as current material
  setMaterial(image) {
    this.materialLoader.setPath("");
    this.currentMaterial = this.materialLoader.load(image, texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      this.currentObject.material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
    });
  }

  //get model
  getModel() {
    //set path to the model and load it
    this.loader.setPath(this.path);
    this.loader.load(this.path, object => {
      //add it to the scene
      this.scene.add(object);
      //save it and rotate it in user's direction
      this.object = object;
      this.object.rotateX(270 * Math.PI / 180);
      this.object.position.y = -0.5;

      this.object.name = "model";
      // this.camera.lookAt(this.object.position);
      this.getMaterials();
    });
  }
}

init();
//const app = new App();
//functions that are responsible for app interaction with website

//start application
function init() {
  //prevent application from rendering another canvas
  let didAppStart = false;
  //some selectors to html tags
  const threeDiv = document.querySelector("#three-app");
  const closeButton = document.querySelector("#three-app-close_button");
  const modal = document.querySelector("#three-app-modal");
  const menuButton = document.querySelector("#three-app-materials_list-button");
  const html = document.getElementsByTagName("html")[0];

  //button which starts the application
  document.querySelector("#app").addEventListener("click", evt => {
    if (didAppStart === false) {
      const model = evt.target.value;
      const app = new App(model);
    }

    //toggle overflow on the website
    toggleScroll(html);
    //"turn on" modal and app's container divs
    modal.classList.remove("not-active");
    threeDiv.classList.remove("not-active");
    //let application know that application has been turned on
    didAppStart = true;
  });

  //toggle scroll and hide application if close button is clicked
  closeButton.addEventListener("click", () => {
    toggleScroll(html);
    toggleApp();
  });

  //toggle menu with images of materials
  menuButton.addEventListener("click", toggleMenu);

  //hide app
  function toggleApp() {
    threeDiv.classList.add("not-active");
    modal.classList.add("not-active");
  }
}

function disableLoadingModal() {
  const loadingModal = document.querySelector("#three-app-loading");
  loadingModal.classList.add("not-active");
}

function toggleMenu() {
  const menu = document.querySelector("#materials-list");
  menu.classList.toggle("not-active");
}

function toggleScroll(element) {
  element.classList.toggle("scroll_hidden");
}
