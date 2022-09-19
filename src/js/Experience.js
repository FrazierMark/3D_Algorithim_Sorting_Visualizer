import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './Sources.js'
import Debug from './Utils/Debug'
import { Mesh } from 'three'

// used to make singleton method
let instance = null

export default class Experience {
    // remember, constructor called when class is instanstiated
    constructor(canvas) {

        if (instance) {
            return instance
        }

        instance = this

        // Global Access
        window.experience = this

        //Options
        this.canvas = canvas

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // sizes has access to method on() because it enherits from the event emitter class
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })


    }
    resize() {
        // this propogates to the children
        this.camera.resize()
        this.renderer.resize()

    }
    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if (this.debug.active)
            this.debug.ui.destroy()
    }
}