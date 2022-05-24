import {BoxGeometry, MeshBasicMaterial, Mesh} from 'three'


class SceneSubject
{
    constructor(geometry, material)
    {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new Mesh(this.geometry, this.material);
    }

    update(elapsedTime)
    {
        this.mesh.rotation.z = Math.sin(elapsedTime);
        this.mesh.rotation.x = Math.cos(elapsedTime);
    }
}

export default SceneSubject;