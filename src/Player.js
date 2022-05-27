import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import {
    Object3D,
    PerspectiveCamera,
    BoxGeometry,
    Mesh,
    Vector3,
    MathUtils
} from 'three';
import config from './config';
import { MeshBasicMaterial } from 'three';

export default class Player
{
    
    constructor(x, y, z)
    {
        const { screen, renderer, canvas } = window.sceneManager;
        canvas.requestPointerLock = canvas.requestPointerLock;
        this.canvas = canvas;
        this.screen = screen;
        this.renderer = renderer
        this.speed = 5;
        this.runSpeed = 10;
        this.velocity = new Vector3()

        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBack = false;
        this.running = false;

        this.camera = new PerspectiveCamera(90, 1, 0.1, 1000);
        this.controls = new PointerLockControls(this.camera, canvas);
        this.controls.canMoveUp = true;
        this.cursorLocked = true;
        this.object = this.setupPlayerObject(x, y, z);
        this.position = this.controls.getObject().position;

        this.registerEventListeners();
    }

    setupPlayerObject(x, y, z)
    {
        var geometry = new BoxGeometry(1, 2, 1);
        var material = new MeshBasicMaterial({color: 0xFF0000, wireframe: false});
        var mesh = new Mesh(geometry, material)
        this.controls.getObject().add(mesh);

        var object = new Object3D();
        object.add(this.camera);
        object.position.set(x, y, z);
        object.userData.name = "player";

        return object;
    }

    registerEventListeners()
    {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('click', () => this.controls.lock());
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    }

    onMouseDown(e)
    {
        // left click
        if(e.buttons === 1)
        {
            console.log("left clicked!");
        }

    }

    onKeyDown(e)
    {
        switch(e.code)
        {
            case "KeyW": 
                this.moveForward = true;
                break;

            case "KeyA": 
                this.moveLeft = true;
                break;

            case "KeyS": 
                this.moveBack = true;
                break;

            case "KeyD": 
                this.moveRight = true;
                break;

            case "KeyE":
                this.object.rotateY()

            case "ShiftLeft":
                console.log("test");
                this.running = true;
                break;

            case "Space":
                this.velocity.y += 0.5;
                break;
                
        }
    }


    onKeyUp(e)
    {
        switch(e.code)
        {
            case "KeyW": 
                this.moveForward = false;
                break;

            case "KeyA": 
                this.moveLeft = false;
                break;

            case "KeyS": 
                this.moveBack = false;
                break;

            case "KeyD": 
                this.moveRight = false;
                break;

            case "ShiftLeft":
                this.running = false;
                break;
        }
    }

    updatePosition(delta)
    {

        let speed = this.running ? this.runSpeed : this.speed;
        let actualSpeed = speed * delta;

        if(this.moveForward)
            this.controls.moveForward(actualSpeed);

        if(this.moveBack)
            this.controls.moveForward(-actualSpeed);

        if(this.moveLeft)
            this.controls.moveRight(-actualSpeed);

        if(this.moveRight)
            this.controls.moveRight(actualSpeed);


        this.velocity.y -= config.world.gravity * delta;
        this.controls.getObject().position.y += this.velocity.y; 
    }

    update(delta)
    {
        this.updatePosition(delta);
    }

    onResize()
    {
        this.camera.aspect = this.screen.width / this.screen.height;
        this.camera.updateProjectionMatrix();
    }

}