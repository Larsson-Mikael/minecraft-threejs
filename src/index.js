import * as THREE from '../node_modules/three';
import World from './World';
import SceneManager from './SceneManager';

const canvas = document.querySelector("#c");
let sceneManager = new SceneManager(canvas);
let clock = new THREE.Clock();

addLights();

let chunk = new World(1024, 1024);
chunk.display(sceneManager.scene);
let frames = 0;
let temp_frames = 0;
let time = 0;

function render()
{
    time += clock.getDelta();

    if( time >= 1)
    {
        time = 0;
        updateFps(frames);
        frames = 0;
    }

    frames += 1;

    sceneManager.update();
    requestAnimationFrame(render);
}

function addLights()
{
    const dLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    const dLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
    dLight.position.x = 1;
    dLight.position.y = 1;
    dLight.position.z = 1;

    dLight2.position.x = -1;
    dLight2.position.y = 1;
    dLight2.position.z = -1;
    sceneManager.scene.add(dLight);
    sceneManager.scene.add(dLight2);
}

function updateFps(frames)
{
    document.querySelector("#fps").innerHTML = frames;
}


render();






