import * as THREE from './three.js/build/three.module.js'
import { MapControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import {OrbitControls} from './three.js/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from './three.js/examples/jsm/loaders/GLTFLoader.js' 
import {FontLoader} from './three.js/examples/jsm/loaders/FontLoader.js' 
import OBJECT from "../furniture/Player.js";

/*
    
    File JS ini hanya digunakan untuk Testing Object saja.

    Untuk melakukan test Object, ubah nama file import pada Line 6.
    Sisanya, silahkan melakukan perubahan pada file .JS tersebut

*/

// ======== Initiate =========
let scene
let ThirdPersonCam
let ThirdPersonCamControl
let ActiveCam
let renderer
let groundFloor
let box
let grid
let raycast
let mouse
let objects
let maxZ
let maxX
let maxY
let difx = 0
let dify = 0 
let difz = 0
let maxdif = 0
let newPoint
let movecounter = 0
let movable
let container = document.getElementById('canvas-holder');

// ======= CREATE =============
let createTPC = () => {
    return new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, 1,1000)
}
let createFloor = () => {
    let geometry = new THREE.PlaneGeometry(250,250)
    let material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        // wireframe: true
    })
    const mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(112.5,0,112.5)
    mesh.rotation.x = -Math.PI / 2
    return mesh
}

let createBox = (a) => {
    let group = new OBJECT().group
    return group
}
let gridHelper = () => {
    let gridHelper = new THREE.GridHelper( 250, 10 );
    gridHelper.position.set(12.5,0,12.5)
    return gridHelper
}
// ============ init =============

let init = () => {
    scene = new THREE.Scene()
    document.getElementById('progress').hidden = true;

    ThirdPersonCam = createTPC()
    ActiveCam = ThirdPersonCam
    renderer = new THREE.WebGLRenderer()
    renderer.antialias = false
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x303030)
    renderer.shadowMap.enabled = true

    groundFloor = createFloor()
    groundFloor.layers.set(1)
    grid = gridHelper()
    box = createBox()

    // Objects

    objects = [
        groundFloor,
        box,
        grid
    ]
        
    objects.forEach(o => {
        scene.add(o)
    })
    
    raycast = new THREE.Raycaster()
    raycast.layers.set(1)
    
    ThirdPersonCam.position.set(150,150,150)
    ThirdPersonCam.rotation.order = 'YXZ';
    ThirdPersonCam.rotation.y = - Math.PI / 4;
    ThirdPersonCam.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );

    ThirdPersonCamControl = new MapControls(ThirdPersonCam, renderer.domElement)

    ThirdPersonCamControl.enableDamping = false;

    container.appendChild(renderer.domElement)
}

window.onload = () => {
    init()
    tryMoveAnimate()
    render()
}

window.onresize = () => {
    let newW = innerWidth
    let newH = innerHeight
    
    renderer.setSize(newW, newH)
    
    ThirdPersonCam.aspect = newW/newH
    ThirdPersonCam.updateProjectionMatrix()
}

let render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, ActiveCam)
}

container.addEventListener("keydown", onDocumentKeyDown);
container.addEventListener("mouseup", onDocumentOnClick);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
};

function onDocumentOnClick(event){
    /* which = 1 itu click kiri */
    /* which = 2 itu scroll click */
    /* which = 3 itu click kanan */
    if(event.which == 1){
        mouse = {}
        let w = window.innerWidth
        let h = window.innerHeight
        mouse.x = event.clientX/w *2 -1
        mouse.y = event.clientY/h *(-2) + 1
    
    }
};


let tryMoveAnimate = () => {
    requestAnimationFrame(tryMoveAnimate)
    // if(movable != undefined) {
    //     if((maxdif-movecounter) > (Math.floor(maxdif/100)+1)){
    //         box.position.x += (difx/maxdif)*(Math.floor(maxdif/100)+1)
    //         box.position.y += (dify/maxdif)*(Math.floor(maxdif/100)+1)
    //         box.position.z += (difz/maxdif)*(Math.floor(maxdif/100)+1)
    //         movecounter += (Math.floor(maxdif/100)+1);
    //     } else {
    //         box.position.x += (difx/maxdif)
    //         box.position.y += (dify/maxdif)
    //         box.position.z += (difz/maxdif)
    //         movecounter += 1;
    //     }

    //     // console.log("Move Counter: " + movecounter + " | Maxdif: " + maxdif + " | "+ (maxdif-movecounter) + " more to go")

    //     if(movecounter >= maxdif){
    //         movecounter = 0;            
    //         movable = null;
    //     }
    // }
renderer.render(scene, ActiveCam)
}


function checkNewLocation(x,y,z){
    console.log(ThirdPersonCam)
    x = Math.round(Math.round(x/25)*25)
    y = Math.round(Math.round(y/25)*25)
    z = Math.round(Math.round(z/25)*25)
    
    if(x < 0){
        x = 0
    } else if (x > maxX){
        x = maxX
    }
    if(y < 0){
        y = 0
    } else if (y > maxY){
        y = maxY
    }
    if(z < 0){
        z = 0
    } else if (z > maxZ){
        z = maxZ
    }

    return new THREE.Vector3(x,y,z)
}

var camera_reset = document.getElementById("cam-reset");
camera_reset.addEventListener("click", camReset, false);

function camReset(event){
    ThirdPersonCam.position.set(box.position.x + 235, box.position.y + 210, box.position.z + 235)
    ThirdPersonCam.lookAt(box)
    ThirdPersonCamControl.update();
    // ThirdPersonCamControl.reset()
}