import config from './config';
import {BlockType, Blocks} from './Block';
import Chunk from './Chunk';
import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise'
import * as THREE from 'three';
import { 
    Mesh,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,
    Vector3,
    Vector2,
    MathUtils,
    MeshLambertMaterial,
    ImageLoader,
    Texture
 } from 'three';
import { MeshPhongMaterial } from 'three';
import { TextureLoader } from 'three';


class World
{
    constructor(textureWidth, textureHeight)
    {
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;
        this.noise = new ImprovedNoise();
        this.chunks = this.generateChunks();
    }

    generateChunks()
    {
        const chunks = {};
        for(let z=0; z < config.world.width; z++)
        {
            for(let x=0; x < config.world.length; x++)
            {
                let data = this.generateChunkData(x, z);
                let id = `${x}.${z}`
                chunks[id] = new Chunk(data);
            }
        }

        return chunks;
    }

    generateChunkData(chunkX, chunkZ)
    {
        let result = [];
        const {length, width, height} = config.chunk;
        const {gap, seed, amp} = config.noise;

        for(let y=0; y < height; y++)
        {
            for(let z=0; z < width; z++)
            {
                for(let x=0; x < length ; x++)
                {
                    let nX = x + chunkX * length;
                    let nZ = z + chunkZ * width;
                    let newX = nX / gap;
                    let newZ = nZ / gap;
                    let val = this.noise.noise(
                        newX, 
                        newZ, 
                        seed) * amp;

                    val += this.noise.noise(
                        newX, 
                        newZ, 
                        seed) * 8;

                    let stoneOffset = this.noise.noise(
                        newX,
                        newZ,
                        seed) * 8;

                    let type = BlockType.GRASS;

                    if(y > val + 70)
                    {
                        type = BlockType.AIR;
                    }


                    if(y < stoneOffset + 60)
                    {
                        type = BlockType.STONE
                    }


                    if(type === BlockType.AIR && y < 65)
                    {
                        type = BlockType.WATER;
                    }

                    result.push(type);
                }
            }
        }


        return result;
    }

    // getChunkData(chunkX, chunkZ)
    // {
    //     return this.chunks[`${chunkX}${chunkZ}`]
    // }

    getChunkData(chunkX, chunkZ)
    {
        return this.chunks[`${chunkX}.${chunkZ}`];
    }

    // get block in world coordinates
    getBlock(x, y, z)
    {
        const {length, width} = config.chunk;

        // Calculate which chunk the block is in.
        let keyX = Math.floor(x / length);
        let keyZ = Math.floor(z / width);

        let chunk = this.getChunkData(keyX, keyZ);

        if(chunk === undefined)
            return;

        // normalize x, z to chunk coordinates.
        let cX = Math.round(x % length);
        let cZ = Math.round(z % width);

        return chunk.getBlock(cX, y, cZ);
    }

    setBlock(x, y, z, type)
    {
        let i = this.to1D(x, y, z);
        this.data[i] = type;
    }

    generateGeometryForChunk(chunkX, chunkY, chunkZ)
    {
        const {length, width, height} = config.chunk;
        const positions = [];
        const normals = [];
        const indices = [];
        const uvs = [];
        const startX = chunkX * length;
        const startY = chunkY * height; 
        const startZ = chunkZ * width;

        for(let y=0; y < height; ++y)
        {
            const blockY = startY + y;
            for(let z=0; z < width ; z++)
            {
                const blockZ = startZ + z;
                for(let x=0; x < length; x++)
                {
                    const blockX = startX + x;
                    const voxel = this.getBlock(blockX, blockY, blockZ);
                    if(voxel)
                    {
                        const block = Blocks[voxel];
                        for(const {dir, corners, dirName} of this.faces)
                        {
                            const i = positions.length / 3;
                            const neighbor = this.getBlock(
                                blockX + dir[0],
                                blockY + dir[1],
                                blockZ +  dir[2],
                            );

                            if(!neighbor)
                            {
                                let ub = 12;
                                let vb = 63;

                                if(dirName === "top")
                                {
                                    ub = block.top.x;
                                    vb = block.top.y;
                                }
                                else if(dirName === "right" || dirName === "left" || dirName === "front" || dirName === "back")
                                {
                                    ub = block.sides.x;
                                    vb = block.sides.y;
                                }
                                else if(dirName === "bottom")
                                {
                                    ub = block.bottom.x;
                                    vb = block.bottom.y;

                                }

                                for(const {pos, uv} of corners)
                                {
                                    positions.push(
                                        pos[0] + x, 
                                        pos[1] + y,
                                        pos[2] + z,
                                    )
                                    uvs.push(
                                        (uv[0] + ub) * 16 / this.textureWidth,
                                        (uv[1] + vb) * 16 / this.textureHeight
                                        // 21 * 0.015625,
                                        // 10 * 0.015625
                                    );

                                    normals.push(...dir);

                                    indices.push(
                                        i, i + 1, i + 2,
                                        i + 2, i + 1, i + 3
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        return {
            positions,
            normals,
            indices,
            uvs
        }
    }

    display(scene)
    {
        const loader = new TextureLoader();
        const texture = loader.load("atlas.png");
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        const material = new MeshLambertMaterial( {map: texture, wireframe: false, transparent: true} );

        for(let z=0; z < config.world.width; z++)
        {
            for(let x=0; x < config.world.length; x++)
            {
                const {positions, normals, indices, uvs} = this.generateGeometryForChunk(x, 0, z);
                const geometry = new BufferGeometry();

                geometry.setAttribute("position", 
                    new BufferAttribute(new Float32Array(positions), 3)
                )

                geometry.setAttribute("normal", 
                    new BufferAttribute(new Float32Array(normals), 3)
                )

                geometry.setAttribute("uv",
                    new BufferAttribute(new Float32Array(uvs), 2) 
                )

                geometry.setIndex(indices);

                const mesh = new Mesh(geometry, material);
                mesh.position.x = x * config.chunk.length;
                mesh.position.z = (z * config.chunk.width);

                scene.add(mesh);
            }
        }

    }

    faces = [
        { // left
            dirName: "left",
            dir: [ -1,  0,  0, ],
            corners: [
                { pos: [ 0, 1, 0 ], uv: [0, 1] },   // TR 
                { pos: [ 0, 0, 0 ], uv: [0, 0] },   // BR
                { pos: [ 0, 1, 1 ], uv: [1, 1] },   // TL
                { pos: [ 0, 0, 1 ], uv: [1, 0] },   // BL
            ],
        },
        { // right
            dirName: "right",
            dir: [  1,  0,  0, ],
            corners: [
                { pos: [ 1, 1, 1 ], uv: [0, 1] },   // TR 
                { pos: [ 1, 0, 1 ], uv: [0, 0] },   // BR
                { pos: [ 1, 1, 0 ], uv: [1, 1] },   // TL
                { pos: [ 1, 0, 0 ], uv: [1, 0] },   // BL
            ],
        },
        { // bottom
            dirName: "bottom",
            dir: [  0, -1,  0, ],
            corners: [
                { pos: [ 1, 0, 1 ], uv: [1, 0] },   // TR 
                { pos: [ 0, 0, 1 ], uv: [0, 0] },   // BR
                { pos: [ 1, 0, 0 ], uv: [1, 1] },   // TL
                { pos: [ 0, 0, 0 ], uv: [0, 1] },   // BL
            ],
        },
        { // top
            dirName: "top",
            dir: [  0,  1,  0],
            corners: [
                { pos: [ 0, 1, 1 ], uv: [1, 1] },   // TR 
                { pos: [ 1, 1, 1 ], uv: [0, 1] },   // BR
                { pos: [ 0, 1, 0 ], uv: [1, 0] },   // TL
                { pos: [ 1, 1, 0 ], uv: [0, 0] },   // BL
            ],
        },
        { // back
            dirName: "back",
            dir: [  0,  0, -1],
            corners: [
                { pos: [ 1, 0, 0 ], uv: [0, 0] },   // TR 
                { pos: [ 0, 0, 0 ], uv: [1, 0] },   // BR
                { pos: [ 1, 1, 0 ], uv: [0, 1] },   // TL
                { pos: [ 0, 1, 0 ], uv: [1, 1] },   // BL
            ],
        },
        { // front
            dirName: "front",
            dir: [  0,  0,  1],
            corners: [
                { pos: [ 0, 0, 1 ], uv: [0, 0] },   // TR 
                { pos: [ 1, 0, 1 ], uv: [1, 0] },   // BR
                { pos: [ 0, 1, 1 ], uv: [0, 1] },   // TL
                { pos: [ 1, 1, 1 ], uv: [1, 1] },   // BL
            ],
        },
    ]

}

export default World;