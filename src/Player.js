import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import {
    Object3D,
    PerspectiveCamera,
    BoxGeometry,
    Mesh,
    Vector3,
} from 'three';
import config from './config';
import { MeshBasicMaterial } from 'three';

export default class Player
{
    
    constructor(x, y, z)
    {
        const { screen, renderer, canvas } = window.sceneManager;
        canvas.requestPointerLock = canvas.requestPointerLock
        this.screen = screen;
        this.renderer = renderer
        this.speed = 5;
        this.lookSpeed = 0.001;
        this.velocity = new Vector3()
        this.velocityBuffer = [];
        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBack = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.camera = new PerspectiveCamera(90, 1, 0.1, 1000);
        //this.controls = new FirstPersonControls(this.camera, renderer.domElement);

        this.geometry = new BoxGeometry(1, 2, 1);
        this.material = new MeshBasicMaterial({color: 0xFF0000});
        this.mesh = new Mesh(this.geometry, this.material)
        this.object = new Object3D();
        this.object.add(this.camera);
        this.object.add(this.mesh);
        this.object.position.set(x, y, z);

        this.registerEventListeners();
    }

    registerEventListeners()
    {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
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
        }
    }

    onMouseMove(e)
    {
        this.mouseX = e.pageX - this.screen.width / 2;
        this.mouseY = e.pageY - this.screen.height / 2;
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
        }
    }

    updatePosition(delta)
    {
        let speed = this.speed * delta;


        if(this.moveForward)
            this.object.translateZ(-speed);

        if(this.moveBack)
            this.object.translateZ(speed);

        if(this.moveLeft)
            this.object.translateX(-speed);

        if(this.moveRight)
            this.object.translateX(speed);


        this.object.position.add(
            new Vector3(
                this.velocity.x * this.speed * delta,
                this.velocity.y * this.speed * delta,
                this.velocity.z * this.speed * delta,
            )
        );
    }

    updateRotation(delta)
    {
        let lookSpeed = this.lookSpeed * delta;

        console.log(this.mouseX);
        console.log(this.mouseY);

        let x = this.mouseX * lookSpeed;
        let y = this.mouseY * lookSpeed;


        this.camera.rotateX(x);
        this.camera.rotateY(y);
    }

    update(delta)
    {
        this.updateRotation(delta);
        this.updatePosition(delta);
    }

    onResize()
    {
        this.camera.aspect = this.screen.width / this.screen.height;
        this.camera.updateProjectionMatrix();
    }

}