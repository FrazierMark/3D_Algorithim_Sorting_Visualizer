import '../css/main.css';
import { getMergeSortAnimations } from './MergeSort.js';
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const ANIMATION_SPEED_MS = 10;
const SECONDARY_COLOR = 0x00FF00;
const PRIMARY_COLOR = 0x0000FF;
const mergeBtn = document.querySelector('.merge_position')
const newArrayBtn = document.querySelector('.new_array_position')
const quickBtn = document.querySelector('.quick_position')
const bubbleBtn = document.querySelector('.bubble_position')
const heapBtn = document.querySelector('.heap_position')

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
    const h = randomNumFromInterval(100, 1000.0)
    stateArray.push(h)
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
    //scene.add(object);
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
    return Math.floor(Math.random() * (max - min) + min) / 100;
}

function mergeSort() {

    const animations = getMergeSortAnimations(stateArray);
    for (let i = 0; i < animations.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = animations[i];

            const barOne = arrayBars[barOneIdx];
            const barTwo = arrayBars[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.material.color.setHex(color);
                barTwo.material.color.setHex(color);
                console.log(barOne.material.color)
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx] = animations[i];

                const xPosition = arrayBars[oneIdx].position.x
                const userIndex = arrayBars[oneIdx].userData.index

                const newHeight = twoIdx

                replaceObjectInGroup(xPosition, oneIdx, newHeight, userIndex)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}

function moveObject(oldPosition, newPosition, object) {
    const tween = new TWEEN.Tween({ x: oldPosition })
        .to({ x: newPosition }, 10)
        .onUpdate((coords) => {
            object.position.x = coords.x
        });
    tween.start()
}

function replaceObjectInGroup(xPosition, oneIdx, newHeight, userIndex) {
    const w = 0.1;
    const h = newHeight
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
    object.position.x = xPosition;
    object.position.z = .5
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData = {
        index: userIndex,
        intensity: 3
    };

    group.children.splice(oneIdx, 1, object)

}