import Experience from "../Experience";
import * as THREE from 'three';

export default class BoxArray {

    // constructors are automatically called when class is instnsiated
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry() {
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

}

