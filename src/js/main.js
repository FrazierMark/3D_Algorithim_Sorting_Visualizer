import '../css/main.css';
import { getMergeSortAnimations } from './SortingAlgorthims.js';
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const ANIMATION_SPEED_MS = 10;
const SECONDARY_COLOR = 'red';
const PRIMARY_COLOR = 'turquoise';
const mergeBtn = document.querySelector('.merge_position')
mergeBtn.addEventListener('click', mergeSort)



// Setup the animation loop.
function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}
requestAnimationFrame(animate)


/**
 * Base
 */
// Debug
const gui = new dat.GUI()



// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()
window.scene = scene
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

/**
 * Lights
 */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
ground.position.set(0, 0.0001, 0)
scene.add(ground);

const grid = new THREE.GridHelper(50, 30, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);


/**
 * Objects
 */

let group = new THREE.Group();
group.position.z = 0;
scene.add(group);



const BOXES = 100;
const stateArray = []

// ***** Clipping planes: *****
const localPlane = new THREE.Plane(new THREE.Vector3(10, -11, 10), 0.8);
const globalPlane = new THREE.Plane(new THREE.Vector3(0, 10, 0), -0.0);

for (let i = 0; i < BOXES; i++) {
    const w = 0.1;
    const h = randomNumFromInterval(0.1, 1000.0)
    stateArray.push(h)
    const minH = 1;
    const geometry = new THREE.BoxGeometry(w, h, w);
    const material = new THREE.MeshStandardMaterial({
        // RGB
        color: new THREE.Color(40, 0.1, 0.1),

        side: THREE.DoubleSide,
        // ***** Clipping setup (material): *****
        clippingPlanes: [localPlane],
        clipShadows: true
    });

    const object = new THREE.Mesh(geometry, material);
    object.position.x = (i - 5) * (w + 0.05);
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData = {
        index: i + 1,
        intensity: 3
    };
    scene.add(object);
    group.add(object)
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Simply tells our renderer to handle shadow maps
renderer.shadowMap.enabled = false

renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ***** Clipping setup (renderer): *****
const globalPlanes = [globalPlane],
    Empty = Object.freeze([]);
renderer.clippingPlanes = globalPlanes; // GUI sets it to globalPlanes
renderer.localClippingEnabled = true;

let folderGlobal = gui.addFolder('Global Clipping'),
propsGlobal = {

    get 'Enabled'() {
        return renderer.clippingPlanes !== Empty;
    },
    set 'Enabled'(v) {
        renderer.clippingPlanes = v ? globalPlanes : Empty;
    },

    get 'Plane'() {
        return globalPlane.constant;
    },
    set 'Plane'(v) {
        globalPlane.constant = v;
    }

};

folderGlobal.add(propsGlobal, 'Enabled');
folderGlobal.add(propsGlobal, 'Plane', - 0.4, 3);




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomNumFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min) / 100;
}


function mergeSort() {
    // THIS GETS ALL ANIMATION\ INFORMATION FIRST???
    const animations = getMergeSortAnimations(stateArray);

    //console.log(group.children[5].geometry.parameters.height)
    console.log(group.children[5].material.color)
    // group.children[5].material.color


    const arrayBars = group.children
    for (let i = 0; i < animations.length; i++) {
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = animations[i];
            const barOneStyle = arrayBars[barOneIdx];
            const barTwoStyle = arrayBars[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOneStyle.material.color.setHex(0xFF0000);
                barTwoStyle.material.color.setHex(0x00FF00);
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                // newHeight is the largerNumber between the 2
                const [barOneIdx, newHeight] = animations[i];

                const barOneStyle = group.children[barOneIdx].geometry.parameters
                console.log(barOneStyle.height)
                //group.children[barOneIdx].geometry.attributes.position.needsUpdate = true


                // barOneStyle.height = newHeight

                group.children[barOneIdx].geometry.attributes.position.needsUpdate = true;

                //barOneStyle.height = `${newHeight}px`;
            }, i * ANIMATION_SPEED_MS);
        }
    }
}