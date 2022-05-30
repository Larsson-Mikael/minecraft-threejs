import { Vector3 } from 'three';
import config from './config';

class Chunk 
{

    constructor(data)
    {
        this.name = name;
        this.data = data;
    }

    /**
     * 3D to 1D index
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns Index
     */
    to1D(x, y, z)
    {
        let xMax = config.chunk.length;
        let zMax = config.chunk.width;
        return (y * xMax * zMax) + (z * xMax) + x;
    }

    /**
     * Returns the normalized chunk position 
     * @param {*} x
     * @param {*} y 
     * @param {*} z 
     */
    worldToChunkPosition(x, y ,z)
    {
        let nX = (x / config.chunk.length % 1) * config.chunk.length;
        let nZ = (z / config.chunk.width % 1) * config.chunk.width;
        return new Vector3(nX, y, nZ);
    }


    /**
     * Set a block type at chunk position 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @param {*} type  - The block type
     */
    setBlock(x, y, z, type)
    {
        let i = this.to1D(x, y, z);
        this.data[i] = type;
    }

    /**
     * Get block type from chunk position
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns 
     */
    getBlock(x, y, z)
    {
        let i = this.to1D(x, y, z);
        return this.data[i];
    }
}

export default Chunk;