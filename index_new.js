/*
    Local Star

    Coding Guide:
        Imports: Line 12
        Constants: Line 19
        Support Check: Line 48
        Code init: Line 65
*/

// Library Imports
import * as THREE from './three.js/build/three.module.js'
import { MapControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls} from './three.js/examples/jsm/controls/PointerLockControls.js';
import {GLTFLoader} from './three.js/examples/jsm/loaders/GLTFLoader.js' 
import {FontLoader} from './three.js/examples/jsm/loaders/FontLoader.js' 

// Variables
const MANAGER = new THREE.LoadingManager();
const GLTF_LOADER = new GLTFLoader(MANAGER);
const CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader();
const FONT_SIZE = 0.08;

const CONTAINER = document.getElementById('canvas-holder');

const SCENE = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-20*(window.innerWidth/window.innerHeight)), (20*(window.innerWidth/window.innerHeight)), 20, -20, -500,2000)
const RENDERER = new THREE.WebGLRenderer({
    antialias: false,
});
const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
const RAYCAST = new THREE.Raycaster()

var time, delta, moveTimer = 0;
var useDeltaTiming = true, weirdTiming = 0;
var prevTime = performance.now();


// Support check
if (!('getContext' in document.createElement('canvas'))) {
    alert('Sorry, it looks like your browser does not support canvas!');
}

// Also make sure webgl is enabled on the current machine
if (WEBGL.isWebGLAvailable()) {
    // If everything is possible, start the app, otherwise show an error
    init();
    gameLoop();
} else {
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
    CANVAS_HOLDER.remove();
    throw 'WebGL disabled or not supported';
}

function init() {
    // Initiate Loading
    initManager()

    // Initiate the Room
    initRenderer()
    initCamera()
    initScene()
    initRoom(8,8)
    // initPlayer()
    window.addEventListener('resize', onWindowResize, false);
}

function initManager() {
    MANAGER.onStart = function(managerUrl, itemsLoaded, itemsTotal) {
        console.log('Started loading: ' + managerUrl + '\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    MANAGER.onProgress = function(managerUrl, itemsLoaded, itemsTotal) {
        document.getElementById('progress-bar').style.width = (itemsLoaded / itemsTotal * 100) + '%';
        console.log('Loading file: ' + managerUrl + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    MANAGER.onLoad = function () {
        // Only allow control once content is fully loaded
        CANVAS_HOLDER.addEventListener('click', function () {
            CONTROLS.lock();
        }, false);

        console.log('Loading complete!');
        document.getElementById('progress').hidden = true;
    };
}

function initRenderer(){
    RENDERER.setSize(window.innerWidth, window.innerHeight)
    RENDERER.setClearColor(0x303030)
    RENDERER.shadowMap.enabled = true
}

function initCamera(){
    CAMERA.position.set(20,20,20)
    CAMERA.rotation.order = 'YXZ';
    CAMERA.rotation.y = - Math.PI / 4;
    CAMERA.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );

    CAMERA_CONTROL.maxDistance = 600;
    CAMERA_CONTROL.minDistance = 150;
    CAMERA_CONTROL.enableDamping = false;

}

function initScene(){
    RAYCAST.layers.set(1)
        
    // ThirdPersonCamControl = new MapControls(ThirdPersonCam, RENDERER.domElement)

    // ThirdPersonCamControl.maxDistance = 600;
    // ThirdPersonCamControl.minDistance = 150;
    // ThirdPersonCamControl.enableDamping = false;

    CONTAINER.appendChild(RENDERER.domElement)
}

function initRoom(x,y){
    // Ground
    let ground = new THREE.PlaneGeometry((x*25),(y*25))
    let ground_texture = TEXTURE_LOADER.load('./texture/ground/ground_test.png')
    ground_texture.wrapS = THREE.RepeatWrapping
    ground_texture.wrapT = THREE.RepeatWrapping
    ground_texture.repeat.set(x,y)
    let ground_material = new THREE.MeshBasicMaterial({
        map: ground_texture,
        side: THREE.DoubleSide
    })
    const ground_mesh = new THREE.Mesh(ground,ground_material)
    ground_mesh.position.set((x*25)/2,0,(y*25)/2)
    ground_mesh.rotation.x = -Math.PI / 2
    SCENE.add(ground_mesh)

    /* Wall
        R = kanan
        L = kiri
    */
    let wall_r = new THREE.PlaneGeometry(x*25,100)
    let wall_r_texture = TEXTURE_LOADER.load('./texture/wall/wall_test.png')
    wall_r_texture.wrapS = THREE.RepeatWrapping
    wall_r_texture.wrapT = THREE.RepeatWrapping
    wall_r_texture.repeat.set(x,1)
    let wall_r_material = new THREE.MeshBasicMaterial({
        map: wall_r_texture,
        side: THREE.DoubleSide
    })
    const wall_r_mesh = new THREE.Mesh(wall_r, wall_r_material)
    wall_r_mesh.position.set((x*25)/2,50,0)
    SCENE.add(wall_r_mesh)

    let wall_l = new THREE.PlaneGeometry(y*25,100)
    let wall_l_texture = TEXTURE_LOADER.load('./texture/wall/wall_test.png')
    wall_l_texture.wrapS = THREE.RepeatWrapping
    wall_l_texture.wrapT = THREE.RepeatWrapping
    wall_l_texture.repeat.set(y,1)
    let wall_l_material = new THREE.MeshBasicMaterial({
        map: wall_l_texture,
        side: THREE.DoubleSide
    })
    const wall_l_mesh = new THREE.Mesh(wall_l, wall_l_material)
    wall_l_mesh.position.set(0,50,(y*25)/2)
    wall_l_mesh.rotation.y = -Math.PI / 2
    SCENE.add(wall_l_mesh)

    // grid helper
    let gridHelper = new THREE.GridHelper( (x*25), x );
    gridHelper.position.set((x*25)/2,0,(y*25)/2)
    SCENE.add(gridHelper)

}

function initPlayer(){
    PLAYER.position.fromArray([0, 25, 0]);
    PLAYER.speedMultiplier = 1
    SCENE.add(PLAYER);

    document.addEventListener('keydown', function (event) {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                PLAYER_MOVE[DIR.FORWARD] = true;
                break;
            case "ArrowLeft":
            case "KeyA":
                PLAYER_MOVE[DIR.LEFT] = true;
                break;
            case "ArrowDown":
            case "KeyS":
                PLAYER_MOVE[DIR.BACKWARD] = true;
                break;
            case "ArrowRight":
            case "KeyD":
                PLAYER_MOVE[DIR.RIGHT] = true;
                break;
            case "KeyE":
            case "PageUp":
            case "Space":
                PLAYER_MOVE[DIR.UP] = true;
                break;
            case "KeyQ":
            case "PageDown":
                PLAYER_MOVE[DIR.DOWN] = true;
                break;
            case "ShiftLeft":
                PLAYER_MOVE[DIR.SPRINT] = true;
                break;
        }
    }, false);

    document.addEventListener('keyup', function (event) {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                PLAYER_MOVE[DIR.FORWARD] = false;
                break;
            case "ArrowLeft":
            case "KeyA":
                PLAYER_MOVE[DIR.LEFT] = false;
                break;
            case "ArrowDown":
            case "KeyS":
                PLAYER_MOVE[DIR.BACKWARD] = false;
                break;
            case "ArrowRight":
            case "KeyD":
                PLAYER_MOVE[DIR.RIGHT] = false;
                break;
            case "KeyE":
            case "PageUp":
            case "Space":
                PLAYER_MOVE[DIR.UP] = false;
                break;
            case "KeyQ":
            case "PageDown":
                PLAYER_MOVE[DIR.DOWN] = false;
                break;
            case "ShiftLeft":
                PLAYER_MOVE[DIR.SPRINT] = false;
                break;
        }
    }, false);
}

function gameLoop() {
        requestAnimationFrame(gameLoop);
    
        time = performance.now();
        if (useDeltaTiming) {
            delta = (time - prevTime) / 1000;
            // some code that checks if timing is weird and then turns off delta-timing
            // this is specifically for those people running this in firefox with privacy.resistFingerprinting enabled
            if (delta === 0.1) {
                weirdTiming += 1;
                if (weirdTiming === 5) {
                    useDeltaTiming = false;
                    console.warn("HUMAN.Riley: performance.now() warning: The performance API in your browser is returning strange time measurements, perhaps due to a privacy or anti-fingerprinting setting you've enabled. This may affect your performance :(")
                }
            }
        } else {
            delta = 1/FRAMERATE;
        }
    
        // Process player input
        // if (CONTROLS.isLocked) {
        //     // Sprinting
        //     let moveSpd;
        //     if (PLAYER_MOVE[DIR.SPRINT]) {
        //         moveSpd = SPEED_SPRINT * PLAYER.speedMultiplier;
        //     } else {
        //         moveSpd = SPEED_NORMAL * PLAYER.speedMultiplier;
        //     }
    
        //     // Move forwards/backwards
        //     let dolly = PLAYER_MOVE[DIR.BACKWARD] - PLAYER_MOVE[DIR.FORWARD];
        //     if (dolly !== 0) {
        //         PLAYER.translateZ(dolly * moveSpd * delta);
        //     }
    
        //     // Move left/right
        //     let strafe = PLAYER_MOVE[DIR.RIGHT] - PLAYER_MOVE[DIR.LEFT];
        //     if (strafe !== 0) {
        //         PLAYER.translateX(strafe * moveSpd * delta);
        //     }
    
        //     // Move up/down
        //     let heave = PLAYER_MOVE[DIR.UP] - PLAYER_MOVE[DIR.DOWN];
        //     if (heave !== 0) {
        //         PLAYER.position.y += (heave * moveSpd * delta);
        //     }
        // }
    
        // Broadcast movement to other players n times per second
        // moveTimer += delta;
        // if (moveTimer >= 1/TICKRATE) {
        //     moveTimer = 0;
        //     emitMove();
        // }
    
        // Move other players (interpolate movement)
        // for (let userid in USERS) {
        //     if (USERS[userid] !== undefined) {
        //         let oldPos = USERS[userid].oldPos;
        //         let pos = USERS[userid].pos;
        //         let rot = USERS[userid].rot;
        //         let a = USERS[userid].alpha;
    
        //         if (USERS[userid].mesh !== undefined) {
        //             USERS[userid].mesh.position.lerpVectors(oldPos, pos, a);
        //             USERS[userid].mesh.quaternion.rotateTowards(rot, USERS[userid].mesh.quaternion.angleTo(rot) * (TICKRATE * delta));
        //             if (USERS[userid].text !== undefined) {
        //                 USERS[userid].text.position.copy(USERS[userid].mesh.position);
        //                 USERS[userid].text.rotation.copy(USERS[userid].mesh.rotation);
        //             }
        //         }
    
        //         USERS[userid].alpha = Math.min(a + delta*(TICKRATE-1), 2);
        //     }
        // }
    
        prevTime = time;
        RENDERER.render(SCENE, CAMERA);
}

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}