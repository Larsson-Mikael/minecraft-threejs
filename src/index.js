import * as THREE from '../node_modules/three';

import World from './World';
import SceneManager from './SceneManager';
import FpsCounter from './FpsCounter';
import Player from './Player';
import config from './config';

const canvas = document.querySelector("#c");
let sceneManager = new SceneManager(canvas);
window.sceneManager = sceneManager;
const player = new Player(20, 80, 20);
sceneManager.scene.add(player.object);
sceneManager.camera = player.camera;
let chunk = new World(1024, 1024);
let clock = new THREE.Clock();
chunk.display(sceneManager.scene);

const counter = new FpsCounter(
    document.querySelector("#fps")
)
addLights();

function checkCollision()
{
    var position = new THREE.Vector3();
    player.controls.getObject().getWorldPosition(position);
    let data = chunk.getChunkFromWorldSpace(Math.round(position.x), Math.round(position.z));
    let chunkPos = data.position;

    var downType = data.chunk.getBlock(
        Math.round(chunkPos.x), 
        Math.round(position.y - 2), 
        Math.round(chunkPos.z))

    if(downType !== 0)
    {
        player.velocity.y = 0.006;
    }
}

function render()
{
    var delta = clock.getDelta();
    player.update(delta);
    checkCollision();
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






