

const config = {
    chunk: {
        length: 16,
        width: 16,
        height: 256,
    },
    noise: {
        gap: 22,
        amp: 16,
        seed: Math.random() * 0xFFFFFF,
    },


    // world size in chunks
    world: {
        length: 16,
        width: 16,
    },

    block: {
        size: 1,
    }
}


export default config;
