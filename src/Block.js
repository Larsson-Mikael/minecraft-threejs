import { Mesh } from "three";


const BlockType = {
    AIR: 0,
    GRASS: 1,
    WATER: 2,
    STONE: 3,
}


const Blocks = [
    {
        name: "air",
        top: {x: 0, y: 0},
        bottom: {x: 0, y: 0},
        sides: {x: 0, y: 0},
    },
    {
        name: "grass",
        top: {
            x: 26,
            y: 62,
        },

        bottom: {
            x: 22,
            y: 53,
        },

        sides: {
            x: 25,
            y: 63,
        }
    },
    {
        name: "water",
        top: {
            x: 9,
            y: 53,
        },
        sides: {
            x: 9,
            y: 53,
        },
        bottom: {
            x: 9,
            y: 53,
        }
    },
    {
        name: "stone",
        top: {
            x: 31,
            y: 40,
        },
        sides: {
            x: 31,
            y: 40,
        },
        bottom: {
            x: 31,
            y: 40,
        }

    }


]


class Block
{
    constructor(type)
    {
        this.type = type;
    }
}

export { Block, BlockType, Blocks };