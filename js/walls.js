class Walls {
  constructor() {
    this.material = new THREE.MeshPhongMaterial({
      visible: true,
      emissive: 0x888888,
      side: THREE.DoubleSide,
    });
    this.meshes = [];
    this.initWalls();
  }

  initWalls() {
    const walls = [
      { size: { x: 7, y: 0.1, z: 7 }, position: { x: 0, y: 0, z: 0 } }
      // { size: { x: 6, y: 6, z: 0.1 }, position: { x: 0, y: 3, z: -3 } },
      // { size: { x: 6, y: 6, z: 0.1 }, position: { x: 0, y: 3, z: 3 } },
      // { size: { x: 0.1, y: 6, z: 6 }, position: { x: 3, y: 3, z: 0 } },
      // { size: { x: 0.1, y: 6, z: 6 }, position: { x: -3, y: 3, z: 0 } },
      //  { size: { x: 6, y: 0.1, z: 6 }, position: { x: 0, y: 6, z: 0 } },
    ];
    walls.map(wall => {
      const geometry = new THREE.BoxGeometry(
        wall.size.x,
        wall.size.y,
        wall.size.z
      );
      const cube = new THREE.Mesh(geometry, this.material);
      cube.receiveShadow = true;
      cube.position.set(wall.position.x, wall.position.y, wall.position.z);
      this.meshes.push(cube);
    });
  }
}
