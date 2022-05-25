import {Clock} from 'three';

export default class FpsCounter
{
    constructor(element)
    {
        this.element = element;
        this.clock = new Clock();
        this.frames = 0;
        this.counter = 0;
    }

    update()
    {
        if(this.counter >= 1)
        {
            this.updateElement(this.frames);
            this.counter = 0;
            this.frames = 0;
        }

        this.counter += this.clock.getDelta();
        this.frames++;
    }

    updateElement(content)
    {
        this.element.innerHTML = content;
    }
}

