import * as THREE from '../node_modules/three';

import World from './World';
import SceneManager from './SceneManager';
import FpsCounter from './FpsCounter';
import Player from './Player';

const canvas = document.querySelector("#c");
let sceneManager = new SceneManager(canvas);
window.sceneManager = sceneManager;
const player = new Player(0, 70, 0);
sceneManager.scene.add(player.object);
sceneManager.camera = player.camera;
let chunk = new World(1024, 1024);
let clock = new THREE.Clock();
chunk.display(sceneManager.scene);

const counter = new FpsCounter(
    document.querySelector("#fps")
)

addLights();

function render()
{
    var delta = clock.getDelta();
    player.update(delta);
    sceneManager.update(delta);
    counter.update();
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

render();






