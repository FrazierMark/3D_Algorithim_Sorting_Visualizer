import '../css/main.css';
import { getMergeSortComparisons } from './MergeSort.js';
import { getQuickSortComparisons } from './QuickSort';
import { getBubbleSortComparisons } from './BubbleSort';
import { getHeapSortComparisons } from './HeapSort';
import { getSelectionSortComparisons } from './SelectionSort';
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import glslify from "glslify"
import fragmentShader from '../../public/shaders/fragmentShader.glsl'
import vertexShader from '../../public/shaders/vertexShader.glsl'


let ANIMATION_SPEED_MS = 100;
let BOXES = 100;
const SECONDARY_COLOR = 0x005A5E;
const PRIMARY_COLOR = 0x4FFFFF;
const PIVOT_COLOR = 0xFFFF00;
const mergeSortBtn = document.querySelector('.merge_position')
const newArrayBtn = document.querySelector('.new_array_position')
const quickSortBtn = document.querySelector('.quick_position')
const bubbleSortBtn = document.querySelector('.bubble_position')
const heapSortBtn = document.querySelector('.heap_position')
const selectionSortBtn = document.querySelector('.selection_position')
const speedSlider = document.querySelector('.speed_slider');
const amountSlider = document.querySelector('.amount_slider')

mergeSortBtn.addEventListener('click', mergeSort)
quickSortBtn.addEventListener('click', quickSort)
bubbleSortBtn.addEventListener('click', bubbleSort)
heapSortBtn.addEventListener('click', heapSort)
selectionSortBtn.addEventListener('click', selectionSort)
newArrayBtn.addEventListener('click', newArray)
speedSlider.addEventListener('input', speedSliderChange);
amountSlider.addEventListener('input', amountSliderChange)

function speedSliderChange() {
    ANIMATION_SPEED_MS = this.value;
}

function amountSliderChange() {
    BOXES = this.value
}


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
//scene.background = new THREE.Color(0xffe3f2fd);
scene.fog = new THREE.Fog(0xffe3f2fd, 10, 50);

/**
 * Lights
 */
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
// hemiLight.position.set(0, 200, 0);
// scene.add(hemiLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x222222)
//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// scene.add(ambientLight)

const dirLight1 = new THREE.DirectionalLight(0xFFA500);
dirLight1.position.set(1, 10, 1);
// const helper = new THREE.DirectionalLightHelper(dirLight1, 5);
// scene.add(helper);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xFFE4E4);
dirLight2.position.set(- 1, 3, 5);
// const helper2 = new THREE.DirectionalLightHelper(dirLight2, 5);
// scene.add(helper2);
scene.add(dirLight2);



// Ground
// const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
// ground.rotation.x = - Math.PI / 2;
// ground.receiveShadow = true;
// ground.position.set(0, 0.0001, 0)
// scene.add(ground);

const grid = new THREE.GridHelper(500, 500, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);


/**
 * Objects
 */

let group = new THREE.Group();
scene.add(group);
group.position.z = 0;


let stateArray = []

// ***** Clipping planes: *****
//const localPlane = new THREE.Plane(new THREE.Vector3(10, -11, 10), 0.8);
const globalPlane = new THREE.Plane(new THREE.Vector3(0, 10, 0), -0.0);

for (let i = 0; i < BOXES; i++) {
    const w = 0.2;
    const h = randomNumFromInterval(100, 1000.0)
    stateArray.push(h)
    const geometry = new THREE.BoxGeometry(w, h, w);
    const material = new THREE.MeshStandardMaterial({
        // RGB
        color: new THREE.Color(0, 4, 1),

        side: THREE.DoubleSide,
        // ***** Clipping setup (material): *****
        //clippingPlanes: [GlobalPlane],
        clipShadows: true
    });

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uColor: { value: new THREE.Color(0x51b1f5) },
            uLightPos: {
                value: new THREE.Vector3(0, 5, 3) // position of spotlight
              },
              uLightColor: {
                value: new THREE.Color(0xffffff) // default light color
              },
              uLightIntensity: {
                value: 0.7 // light intensity
              },
        }
    });

    const object = new THREE.Mesh(geometry, shaderMaterial);
    //let setArrayStart = Math.floor(Boxes)
    object.position.x = (i - (Math.floor(BOXES / 2))) * (w + 0.06);
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData = {
        index: i + 1,
        intensity: 3
    };
    object.setColor = function (color) {
        object.material.color.set(color);
    }

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
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 2000)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.setClearColor(0xffffff, 0);
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
    const comparisons = getMergeSortComparisons(stateArray);
    for (let i = 0; i < comparisons.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = comparisons[i];
            const barOne = group.children[barOneIdx];
            const barTwo = group.children[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.setColor(color);
                barTwo.setColor(color);
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx] = comparisons[i];
                const xPosition = group.children[oneIdx].position.x
                const userIndex = group.children[oneIdx].userData.index
                const newHeight = twoIdx
                replaceObjectInGroup(xPosition, oneIdx, newHeight, userIndex)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}

function quickSort() {
    const comparisons = getQuickSortComparisons(stateArray)
    for (let i = 0; i < comparisons.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx, pivot] = comparisons[i];
            const barOne = group.children[barOneIdx];
            const barTwo = group.children[barTwoIdx];
            let roundedPivot = Math.round(pivot)
            const pivotPosition = group.children[roundedPivot];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.setColor(color);
                barTwo.setColor(color);
                pivotPosition.setColor(PIVOT_COLOR)
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx, pivot] = comparisons[i];
                //update physical position
                let oneIdxPosition = group.children[oneIdx].position.x
                let twoIdxPosition = group.children[twoIdx].position.x
                moveObject(oneIdxPosition, twoIdxPosition, group.children[oneIdx])
                moveObject(twoIdxPosition, oneIdxPosition, group.children[twoIdx])
                // update position within the array 
                swap(group.children, oneIdx, twoIdx)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}

function bubbleSort() {
    const comparisons = getBubbleSortComparisons(stateArray)
    for (let i = 0; i < comparisons.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = comparisons[i];
            const barOne = group.children[barOneIdx];
            const barTwo = group.children[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.setColor(color);
                barTwo.setColor(color);
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx] = comparisons[i];
                //update physical position
                let oneIdxPosition = group.children[oneIdx].position.x
                let twoIdxPosition = group.children[twoIdx].position.x
                moveObject(oneIdxPosition, twoIdxPosition, group.children[oneIdx])
                moveObject(twoIdxPosition, oneIdxPosition, group.children[twoIdx])
                // update position within the array 
                swap(group.children, oneIdx, twoIdx)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}

function heapSort() {
    const comparisons = getHeapSortComparisons(stateArray)
    for (let i = 0; i < comparisons.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = comparisons[i];
            const barOne = group.children[barOneIdx];
            const barTwo = group.children[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.setColor(color);
                barTwo.setColor(color);
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx] = comparisons[i];
                //update physical position
                let oneIdxPosition = group.children[oneIdx].position.x
                let twoIdxPosition = group.children[twoIdx].position.x
                moveObject(oneIdxPosition, twoIdxPosition, group.children[oneIdx])
                moveObject(twoIdxPosition, oneIdxPosition, group.children[twoIdx])
                // update position within the array 
                swap(group.children, oneIdx, twoIdx)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}

function selectionSort() {
    const comparisons = getSelectionSortComparisons(stateArray)
    for (let i = 0; i < comparisons.length; i++) {
        const arrayBars = group.children
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
            const [barOneIdx, barTwoIdx] = comparisons[i];
            const barOne = group.children[barOneIdx];
            const barTwo = group.children[barTwoIdx];
            const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
            setTimeout(() => {
                barOne.setColor(color);
                barTwo.setColor(color);
            }, i * ANIMATION_SPEED_MS);
        } else {
            setTimeout(() => {
                const [oneIdx, twoIdx] = comparisons[i];
                //update physical position
                let oneIdxPosition = group.children[oneIdx].position.x
                let twoIdxPosition = group.children[twoIdx].position.x
                moveObject(oneIdxPosition, twoIdxPosition, group.children[oneIdx])
                moveObject(twoIdxPosition, oneIdxPosition, group.children[twoIdx])
                // update position within the array 
                swap(group.children, oneIdx, twoIdx)
            }, i * ANIMATION_SPEED_MS);
        }
    }
}



function moveObject(oldPosition, newPosition, object) {
    const tween = new TWEEN.Tween({ x: oldPosition })
        .to({ x: newPosition }, ANIMATION_SPEED_MS)
        .onUpdate((coords) => {
            object.position.x = coords.x
        });
    tween.start()
}

function swap(array, leftIndex, rightIndex) {
    var temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
}

function replaceObjectInGroup(xPosition, oneIdx, newHeight, userIndex) {
    const w = 0.2;
    const h = newHeight
    const geometry = new THREE.BoxGeometry(w, h, w);
    const material = new THREE.MeshStandardMaterial({
        // RGB
        color: new THREE.Color(0, 4, 1),
        side: THREE.DoubleSide,
        // ***** Clipping setup (material): *****
        clippingPlanes: [globalPlane],
        clipShadows: true
    });

    const object = new THREE.Mesh(geometry, material);
    object.position.x = xPosition;
    object.position.z = .5
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData = {
        index: userIndex,
        intensity: 2
    };
    object.setColor = function (color) {
        object.material.color.set(color);
    }
    group.children.splice(oneIdx, 1, object)
}

function newArray() {

    while (group.children.length)
        group.remove(group.children[0])
    stateArray = []

    for (let i = 0; i < BOXES; i++) {
        const w = 0.2;
        const h = randomNumFromInterval(100, 1000.0)
        stateArray.push(h)
        const geometry = new THREE.BoxGeometry(w, h, w);
        const material = new THREE.MeshStandardMaterial({
            // RGB
            color: new THREE.Color(0, 4, 1),
            flatShading: true,
            side: THREE.DoubleSide,
            // ***** Clipping setup (material): *****
            clippingPlanes: [globalPlane],
            clipShadows: true
        });

        const object = new THREE.Mesh(geometry, material);
        object.position.x = (i - (BOXES / 2)) * (w + 0.06);
        object.castShadow = true;
        object.receiveShadow = true;
        object.userData = {
            index: i + 1,
            intensity: 3
        };

        object.setColor = function (color) {
            object.material.color.set(color);
        }
        group.add(object)
    }
}
