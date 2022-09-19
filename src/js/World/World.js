import * as THREE from 'three';
import Experience from "../Experience";
import Environment from './Enviornment';
import Floor from './Floor.js'
import Fox from './Fox';
import BoxArray from './BoxArray';

export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        //Test Mesh
        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxBufferGeometry(2, 2, 2),
        //     new THREE.MeshStandardMaterial()
        // )

       // this.scene.add(testMesh)


        // Once all resources are loaded we create the world
        this.resources.on('ready', () => {

            // Setup
            
            //this.floor = new Floor()
            // this.fox = new Fox()
            this.environment = new Environment()
            this.boxArray = new BoxArray()
        })

    }

    update() {
        if (this.fox) {
            this.fox.update()
        }
    }
}