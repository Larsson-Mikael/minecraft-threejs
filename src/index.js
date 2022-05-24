import * as THREE from '../node_modules/three';
import World from './World';
import SceneManager from './SceneManager';

const canvas = document.querySelector("#c");
let sceneManager = new SceneManager(canvas);
addLights();

let chunk = new World(1024, 1024);
chunk.display(sceneManager.scene);

function render()
{
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

render();






