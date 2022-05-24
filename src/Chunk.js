import config from './config';

class Chunk 
{

    constructor(data)
    {
        this.name = name;
        this.data = data;
    }

    to1D(x, y, z)
    {
        let xMax = config.chunk.length;
        let zMax = config.chunk.width;
        return (y * xMax * zMax) + (z * xMax) + x;
    }


    setBlock(x, y, z, type)
    {
        let i = this.to1D(x, y, z);
        this.data[i] = type;
    }

    // in chunk coordinates
    getBlock(x, y, z)
    {
        let i = this.to1D(x, y, z);
        return this.data[i];
    }
}

export default Chunk;